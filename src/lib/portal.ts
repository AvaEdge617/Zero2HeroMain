export type PortalRole = 'founder' | 'user'
export type AccountStatus = 'approved' | 'pending'
export type AccountProgram = 'zero2hero' | 'your-shot'

export interface PortalAccount {
  id: string
  username: string
  displayName: string
  password: string
  mustChangePassword: boolean
  securityPin?: string
  completedCompanionLessons?: string[]
  program: AccountProgram
  role: PortalRole
  status: AccountStatus
  agreedToPositivity: boolean
  createdAt: string
}

export interface PasswordResetRequest {
  id: string
  accountId: string
  username: string
  pinPassed: boolean
  status: 'pending' | 'approved' | 'denied'
  createdAt: string
}

export interface FeedComment {
  id: string
  author: string
  text: string
  createdAt: string
}

export interface AudioPost {
  id: string
  author: string
  title: string
  caption: string
  fileName: string
  audioDataUrl: string
  likes: string[]
  comments: FeedComment[]
  createdAt: string
}

export interface ChatPost {
  id: string
  author: string
  text: string
  createdAt: string
}

export interface PortalState {
  accounts: PortalAccount[]
  recordings: AudioPost[]
  chat: ChatPost[]
  resetRequests: PasswordResetRequest[]
}

export const POSITIVITY_CLAUSE = 'I will keep feedback specific, constructive, and encouraging. I will critique the mix, never the person, and I will not post harassment, hate, or personal attacks.'

export const SEEDED_ACCOUNTS: PortalAccount[] = [
  { id: 'founder-onna', username: 'Onna', displayName: 'Onna', password: 'BuckNasty', mustChangePassword: false, securityPin: '0205', program: 'zero2hero', role: 'founder', status: 'approved', agreedToPositivity: true, createdAt: '2026-09-22T00:00:00.000Z' },
  { id: 'user-djlucidsync', username: 'DJLucidSync', displayName: 'DJLucidSync', password: 'BuckNasty', mustChangePassword: false, securityPin: '0205', program: 'your-shot', role: 'user', status: 'approved', agreedToPositivity: true, createdAt: '2026-09-22T00:00:00.000Z' },
]

const KEY = 'zero2hero.dj-portal.v1'

export function defaultPortalState(): PortalState {
  return { accounts: SEEDED_ACCOUNTS.map((account) => ({ ...account })), recordings: [], chat: [], resetRequests: [] }
}

export function loadPortalState(): PortalState {
  try {
    const saved = localStorage.getItem(KEY)
    if (!saved) return defaultPortalState()
    const parsed = JSON.parse(saved) as PortalState
    const accountMap = new Map(parsed.accounts.map((account) => [account.id, account]))
    SEEDED_ACCOUNTS.forEach((account) => { if (!accountMap.has(account.id)) parsed.accounts.unshift({ ...account }) })
    parsed.accounts = parsed.accounts.map((account) => {
      const seeded = SEEDED_ACCOUNTS.find((item) => item.id === account.id)
      if (seeded) return { ...account, ...seeded, completedCompanionLessons: account.completedCompanionLessons ?? [] }
      return { ...account, program: account.program ?? 'your-shot', mustChangePassword: account.mustChangePassword ?? false, completedCompanionLessons: account.completedCompanionLessons ?? [] }
    })
    return { ...parsed, resetRequests: parsed.resetRequests ?? [] }
  } catch {
    return defaultPortalState()
  }
}

export function savePortalState(state: PortalState) {
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function authenticate(accounts: PortalAccount[], username: string, password: string, program?: AccountProgram) {
  return accounts.find((account) => account.username.toLowerCase() === username.trim().toLowerCase() && account.password === password && account.status === 'approved' && (!program || account.role === 'founder' || account.program === program))
}

export function isPositiveEnough(text: string) {
  const blocked = ['idiot', 'stupid', 'trash', 'garbage', 'hate you', 'kill yourself']
  const normalized = text.toLowerCase()
  return text.trim().length > 0 && !blocked.some((term) => normalized.includes(term))
}

export function defaultPassword(username: string) {
  return `${username}0205`
}

export function pinPasses(account: PortalAccount, pin: string) {
  return Boolean(account.securityPin) && account.securityPin === pin.trim()
}
