import crypto from 'node:crypto'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import bcrypt from 'bcryptjs'
import pg from 'pg'
import { z } from 'zod'

const { Pool } = pg
const required = ['DATABASE_URL', 'FOUNDER_PASSWORD', 'DJ_PASSWORD']
for (const name of required) if (!process.env[name]) throw new Error(`${name} is required`)

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined })
const app = express()
const origins = new Set((process.env.ALLOWED_ORIGINS ?? 'http://localhost:5173,http://localhost:5174').split(',').map((item) => item.trim()).filter(Boolean))
const cookieName = 'z2h_session'
const sessionDays = 14
const attempts = new Map()

app.set('trust proxy', 1)
app.use(helmet())
app.use((req, res, next) => {
  if (req.headers.origin && !origins.has(req.headers.origin)) return res.status(403).json({ error: 'Origin not allowed' })
  next()
})
app.use(cors({ origin(origin, callback) { if (!origin || origins.has(origin)) callback(null, true); else callback(new Error('Origin not allowed')) }, credentials: true }))
app.use(express.json({ limit: '64kb' }))
app.use(cookieParser())

const accountFields = `id, username, display_name AS "displayName", role, program, status, must_change_password AS "mustChangePassword"`
const normalize = (value) => value.trim().toLowerCase()
const defaultPassword = (username) => `${username}0205`
const tokenHash = (token) => crypto.createHash('sha256').update(token).digest('hex')
const validPassword = (password) => password.length >= 12 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password)

async function initDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS accounts (
      id UUID PRIMARY KEY,
      username TEXT NOT NULL,
      username_key TEXT NOT NULL UNIQUE,
      display_name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      security_pin_hash TEXT,
      role TEXT NOT NULL CHECK (role IN ('founder','user')),
      program TEXT NOT NULL CHECK (program IN ('zero2hero','your-shot')),
      status TEXT NOT NULL CHECK (status IN ('pending','approved')),
      must_change_password BOOLEAN NOT NULL DEFAULT TRUE,
      agreed_to_positivity BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS reset_requests (
      id UUID PRIMARY KEY,
      account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
      pin_passed BOOLEAN NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('pending','approved','denied')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `)
  const seeds = [
    { username: process.env.FOUNDER_USERNAME ?? 'Onna', displayName: 'Onna', password: process.env.FOUNDER_PASSWORD, role: 'founder', program: 'zero2hero' },
    { username: process.env.DJ_USERNAME ?? 'DJLucidSync', displayName: 'DJLucidSync', password: process.env.DJ_PASSWORD, role: 'user', program: 'your-shot' },
  ]
  for (const seed of seeds) {
    const hash = await bcrypt.hash(seed.password, 12)
    await pool.query(`INSERT INTO accounts (id, username, username_key, display_name, password_hash, security_pin_hash, role, program, status, must_change_password, agreed_to_positivity)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'approved',FALSE,TRUE)
      ON CONFLICT (username_key) DO UPDATE SET role=EXCLUDED.role, program=EXCLUDED.program, status='approved', password_hash=CASE WHEN EXCLUDED.role='founder' THEN EXCLUDED.password_hash ELSE accounts.password_hash END`,
      [crypto.randomUUID(), seed.username, normalize(seed.username), seed.displayName, hash, await bcrypt.hash(process.env.SEED_SECURITY_PIN ?? '0205', 12), seed.role, seed.program])
  }
  await pool.query('DELETE FROM sessions WHERE expires_at <= NOW()')
}

async function currentAccount(req) {
  const token = req.cookies[cookieName]
  if (!token) return null
  const result = await pool.query(`SELECT ${accountFields} FROM sessions s JOIN accounts a ON a.id=s.account_id WHERE s.token_hash=$1 AND s.expires_at>NOW()`, [tokenHash(token)])
  return result.rows[0] ?? null
}
const requireAccount = async (req, res, next) => { const account = await currentAccount(req); if (!account) return res.status(401).json({ error: 'Authentication required' }); req.account = account; next() }
const requireFounder = async (req, res, next) => { const account = await currentAccount(req); if (!account || account.role !== 'founder') return res.status(403).json({ error: 'Founder access required' }); req.account = account; next() }
const setSession = async (res, accountId) => {
  const token = crypto.randomBytes(32).toString('base64url')
  await pool.query('INSERT INTO sessions (token_hash, account_id, expires_at) VALUES ($1,$2,NOW()+$3::interval)', [tokenHash(token), accountId, `${sessionDays} days`])
  res.cookie(cookieName, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', partitioned: process.env.NODE_ENV === 'production', maxAge: sessionDays * 86400000, path: '/' })
}

app.get('/health', (_req, res) => res.json({ ok: true }))
app.get('/api/auth/session', async (req, res) => { const account = await currentAccount(req); res.json({ account }) })
app.post('/api/auth/signup', async (req, res) => {
  const parsed = z.object({ username: z.string().trim().min(3).max(40).regex(/^[A-Za-z0-9_-]+$/), displayName: z.string().trim().min(1).max(80), program: z.enum(['zero2hero', 'your-shot']), agreedToPositivity: z.boolean().optional() }).safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Check the signup fields.' })
  if (parsed.data.program === 'your-shot' && !parsed.data.agreedToPositivity) return res.status(400).json({ error: 'Agree to the positivity clause.' })
  try {
    await pool.query(`INSERT INTO accounts (id,username,username_key,display_name,password_hash,role,program,status,must_change_password,agreed_to_positivity) VALUES ($1,$2,$3,$4,$5,'user',$6,'pending',TRUE,$7)`, [crypto.randomUUID(), parsed.data.username, normalize(parsed.data.username), parsed.data.displayName, await bcrypt.hash(defaultPassword(parsed.data.username), 12), parsed.data.program, Boolean(parsed.data.agreedToPositivity)])
    res.status(201).json({ ok: true })
  } catch (error) { if (error.code === '23505') return res.status(409).json({ error: 'That username is already taken.' }); throw error }
})
app.post('/api/auth/login', async (req, res) => {
  const parsed = z.object({ username: z.string().trim().min(1).max(80), password: z.string().min(1).max(200), program: z.enum(['zero2hero','your-shot']) }).safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Username and password are required.' })
  const key = `${req.ip}:${normalize(parsed.data.username)}`; const record = attempts.get(key)
  if (record && record.until > Date.now() && record.count >= 8) return res.status(429).json({ error: 'Too many attempts. Try again later.' })
  const result = await pool.query(`SELECT ${accountFields}, password_hash FROM accounts WHERE username_key=$1 AND status='approved' AND (role='founder' OR program=$2)`, [normalize(parsed.data.username), parsed.data.program])
  const account = result.rows[0]
  if (!account || !await bcrypt.compare(parsed.data.password, account.password_hash)) { const count = (record?.count ?? 0) + 1; attempts.set(key, { count, until: Date.now() + 15 * 60_000 }); return res.status(401).json({ error: 'That login did not match an approved account.' }) }
  attempts.delete(key); delete account.password_hash; await setSession(res, account.id); res.json({ account })
})
app.post('/api/auth/logout', async (req, res) => { const token = req.cookies[cookieName]; if (token) await pool.query('DELETE FROM sessions WHERE token_hash=$1', [tokenHash(token)]); res.clearCookie(cookieName, { path: '/', secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', partitioned: process.env.NODE_ENV === 'production' }); res.json({ ok: true }) })
app.post('/api/auth/first-login', requireAccount, async (req, res) => {
  const parsed = z.object({ password: z.string().max(200), pin: z.string().regex(/^\d{4,8}$/) }).safeParse(req.body)
  if (!parsed.success || !validPassword(parsed.data.password)) return res.status(400).json({ error: 'Use 12+ characters with uppercase, lowercase, and a number.' })
  await pool.query('UPDATE accounts SET password_hash=$1, security_pin_hash=$2, must_change_password=FALSE WHERE id=$3', [await bcrypt.hash(parsed.data.password, 12), await bcrypt.hash(parsed.data.pin, 12), req.account.id]); res.json({ ok: true })
})
app.post('/api/auth/reset-request', async (req, res) => {
  const parsed = z.object({ username: z.string().trim().min(1).max(80), pin: z.string().max(20), program: z.enum(['zero2hero','your-shot']) }).safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Check the reset fields.' })
  const result = await pool.query(`SELECT id, security_pin_hash FROM accounts WHERE username_key=$1 AND status='approved' AND (role='founder' OR program=$2)`, [normalize(parsed.data.username), parsed.data.program]); const account = result.rows[0]
  if (account && !(await pool.query("SELECT 1 FROM reset_requests WHERE account_id=$1 AND status='pending'", [account.id])).rowCount) await pool.query("INSERT INTO reset_requests (id,account_id,pin_passed,status) VALUES ($1,$2,$3,'pending')", [crypto.randomUUID(), account.id, account.security_pin_hash ? await bcrypt.compare(parsed.data.pin, account.security_pin_hash) : false])
  res.json({ ok: true, message: 'If the account exists, the Founder will review the request.' })
})
app.get('/api/founder/accounts', requireFounder, async (_req, res) => { const accounts = await pool.query(`SELECT ${accountFields} FROM accounts ORDER BY created_at`); const resets = await pool.query(`SELECT r.id, r.account_id AS "accountId", a.username, r.pin_passed AS "pinPassed", r.status, r.created_at AS "createdAt" FROM reset_requests r JOIN accounts a ON a.id=r.account_id WHERE r.status='pending' ORDER BY r.created_at`); res.json({ accounts: accounts.rows, resetRequests: resets.rows }) })
app.post('/api/founder/accounts/:id/:action', requireFounder, async (req, res) => {
  const action = req.params.action
  if (!['approve','decline','delete','reset'].includes(action) || req.params.id === req.account.id) return res.status(400).json({ error: 'Invalid account action.' })
  if (action === 'approve') { const found = await pool.query('SELECT username FROM accounts WHERE id=$1', [req.params.id]); if (!found.rowCount) return res.status(404).json({ error: 'Account not found.' }); await pool.query("UPDATE accounts SET status='approved',password_hash=$1,must_change_password=TRUE WHERE id=$2", [await bcrypt.hash(defaultPassword(found.rows[0].username), 12), req.params.id]) }
  if (action === 'reset') { const found = await pool.query('SELECT username FROM accounts WHERE id=$1', [req.params.id]); if (!found.rowCount) return res.status(404).json({ error: 'Account not found.' }); await pool.query('UPDATE accounts SET password_hash=$1,must_change_password=TRUE WHERE id=$2', [await bcrypt.hash(defaultPassword(found.rows[0].username), 12), req.params.id]); await pool.query('DELETE FROM sessions WHERE account_id=$1', [req.params.id]) }
  if (action === 'decline' || action === 'delete') await pool.query("DELETE FROM accounts WHERE id=$1 AND role<>'founder'", [req.params.id])
  res.json({ ok: true })
})
app.post('/api/founder/resets/:id/:action', requireFounder, async (req, res) => {
  const result = await pool.query(`SELECT r.account_id, r.pin_passed, a.username FROM reset_requests r JOIN accounts a ON a.id=r.account_id WHERE r.id=$1 AND r.status='pending'`, [req.params.id]); const request = result.rows[0]
  if (!request || !['approve','deny'].includes(req.params.action)) return res.status(404).json({ error: 'Reset request not found.' })
  if (req.params.action === 'approve' && !request.pin_passed) return res.status(400).json({ error: 'PIN check failed.' })
  if (req.params.action === 'approve') { await pool.query('UPDATE accounts SET password_hash=$1,must_change_password=TRUE WHERE id=$2', [await bcrypt.hash(defaultPassword(request.username), 12), request.account_id]); await pool.query('DELETE FROM sessions WHERE account_id=$1', [request.account_id]) }
  await pool.query('UPDATE reset_requests SET status=$1 WHERE id=$2', [req.params.action === 'approve' ? 'approved' : 'denied', req.params.id]); res.json({ ok: true })
})

app.use((error, _req, res, _next) => { console.error(error); res.status(500).json({ error: 'Server error.' }) })
const port = Number(process.env.PORT ?? 8787)
try {
  console.log('Initializing ZERO 2 HERO database')
  await initDatabase()
  console.log('ZERO 2 HERO database ready')
  app.listen(port, '0.0.0.0', () => console.log(`ZERO 2 HERO API listening on ${port}`))
} catch (error) {
  console.error('ZERO 2 HERO startup failed', error)
  await pool.end().catch(() => {})
  process.exit(1)
}
