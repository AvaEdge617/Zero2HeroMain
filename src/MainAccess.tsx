import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { authenticate, defaultPassword, loadPortalState, pinPasses, savePortalState, type PortalAccount, type PortalState } from './lib/portal'
import { FirstLoginSetup, MemberApprovals } from './Portal'

export default function MainAccess({ back, startJourney, continueJourney }: { back: () => void; startJourney: () => void; continueJourney?: () => void }) {
  const [state, setState] = useState<PortalState>(() => loadPortalState())
  const [accountId, setAccountId] = useState<string | null>(null)
  const account = state.accounts.find((item) => item.id === accountId)
  useEffect(() => savePortalState(state), [state])

  if (!account) return <MainLogin state={state} setState={setState} login={setAccountId} back={back} />
  if (account.mustChangePassword) return <FirstLoginSetup account={account} finish={(password, pin) => setState({ ...state, accounts: state.accounts.map((item) => item.id === account.id ? { ...item, password, securityPin: pin, mustChangePassword: false } : item) })} logout={() => setAccountId(null)} />

  return <section className="portal-shell">
    <header className="portal-head"><button className="portal-wordmark" onClick={back}><span>ZERO 2 HERO</span><b>MEMBER ACCESS</b></button><nav>{account.role === 'founder' && <span className="founder-access-label">Founder dashboard</span>}</nav><div className="portal-profile"><span>{account.displayName.slice(0, 2).toUpperCase()}</span><div><b>{account.displayName}</b><small>{account.role}</small></div><button onClick={() => setAccountId(null)}>Log out</button></div></header>
    <main className="portal-main">{account.role === 'founder' ? <MemberApprovals state={state} setState={setState} currentAccount={account} /> : <section className="member-home"><small>WELCOME BACK, HERO</small><h1>Your next Mission<br />starts here.</h1><p>Open your Journey dashboard or begin a new path toward a real skill you can prove.</p><div className="hero-actions">{continueJourney && <button className="primary" onClick={continueJourney}>Continue my Journey</button>}<button className="secondary" onClick={startJourney}>Start a new Journey</button></div></section>}</main>
  </section>
}

function MainLogin({ state, setState, login, back }: { state: PortalState; setState: (state: PortalState) => void; login: (id: string) => void; back: () => void }) {
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login')
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [pin, setPin] = useState('')
  const [message, setMessage] = useState('')
  const submit = (event: FormEvent) => {
    event.preventDefault(); setMessage('')
    if (mode === 'login') {
      const account = authenticate(state.accounts, username, password, 'zero2hero')
      if (account) login(account.id)
      else setMessage(state.accounts.some((item) => item.username.toLowerCase() === username.trim().toLowerCase() && item.status === 'pending' && item.program === 'zero2hero') ? 'Your ZERO 2 HERO signup is waiting for Founder approval.' : 'That login did not match an approved ZERO 2 HERO account.')
      return
    }
    if (mode === 'reset') {
      const account = state.accounts.find((item) => item.username.toLowerCase() === username.trim().toLowerCase() && item.status === 'approved' && (item.role === 'founder' || item.program === 'zero2hero'))
      if (!account) { setMessage('No approved ZERO 2 HERO account matches that username.'); return }
      if (state.resetRequests.some((request) => request.accountId === account.id && request.status === 'pending')) { setMessage('A reset request is already waiting for Founder review.'); return }
      setState({ ...state, resetRequests: [...state.resetRequests, { id: crypto.randomUUID(), accountId: account.id, username: account.username, pinPassed: pinPasses(account, pin), status: 'pending', createdAt: new Date().toISOString() }] })
      setMode('login'); setPin(''); setMessage('Reset request sent. The Founder will see a PIN pass or fail result.')
      return
    }
    if (state.accounts.some((item) => item.username.toLowerCase() === username.trim().toLowerCase())) { setMessage('That username is already taken.'); return }
    const next: PortalAccount = { id: crypto.randomUUID(), username: username.trim(), displayName: displayName.trim() || username.trim(), password: defaultPassword(username.trim()), mustChangePassword: true, program: 'zero2hero', role: 'user', status: 'pending', agreedToPositivity: false, createdAt: new Date().toISOString() }
    setState({ ...state, accounts: [...state.accounts, next] }); setMode('login'); setPassword(''); setMessage('Signup sent. A Founder must approve it before you can log in.')
  }
  return <section className="portal-login"><button className="back-link" onClick={back}>← Back to home</button><div className="portal-login-grid"><div className="portal-login-story"><span className="portal-chip">ZERO 2 HERO MEMBER ACCESS</span><h1>Build the skill.<br /><em>Show the work.</em></h1><p>Regular ZERO 2 HERO accounts open the Journey experience. Your Shot course access is requested separately through the public Your Shot portal link.</p></div><form className="portal-login-card" onSubmit={submit}><small>ZERO 2 HERO</small><h2>{mode === 'login' ? 'Log in.' : mode === 'signup' ? 'Request an account.' : 'Request a password reset.'}</h2>{mode === 'signup' && <label><span>Display name</span><input required value={displayName} onChange={(event) => setDisplayName(event.target.value)} /></label>}<label><span>Username</span><input required value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" /></label>{mode === 'login' && <label><span>Password</span><input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /></label>}{mode === 'reset' && <label><span>Security PIN</span><input required inputMode="numeric" pattern="[0-9]{4,8}" type="password" value={pin} onChange={(event) => setPin(event.target.value)} placeholder="4–8 digits" /></label>}{mode === 'signup' && <p className="default-password-note">After approval, your temporary password will be <b>{username || 'username'}0205</b>. You must replace it and create a security PIN at first login.</p>}{message && <p className="form-message">{message}</p>}<button className="primary full" type="submit">{mode === 'login' ? 'Log in' : mode === 'signup' ? 'Send signup request' : 'Send reset request'}</button><button className="text-button" type="button" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMessage('') }}>{mode === 'login' ? 'Create a ZERO 2 HERO account' : 'Back to login'}</button>{mode === 'login' && <button className="text-button" type="button" onClick={() => { setMode('reset'); setMessage('') }}>Forgot password? Request a reset</button>}</form></div></section>
}
