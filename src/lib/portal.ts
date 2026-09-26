export type PortalRole = 'founder' | 'user'
export type AccountStatus = 'approved' | 'pending'
export type AccountProgram = 'zero2hero' | 'your-shot'

export interface PortalAccount {
  id: string
  username: string
  displayName: string
  mustChangePassword: boolean
  completedCompanionLessons?: string[]
  program: AccountProgram
  role: PortalRole
  status: AccountStatus
  agreedToPositivity?: boolean
  createdAt?: string
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

const KEY = 'zero2hero.dj-portal.v1'

export function defaultPortalState(): PortalState {
  return { accounts: [], recordings: [], chat: [], resetRequests: [] }
}

export function loadPortalState(): PortalState {
  try {
    const saved = localStorage.getItem(KEY)
    if (!saved) return defaultPortalState()
    const parsed = JSON.parse(saved) as PortalState
    parsed.accounts = []
    return { ...parsed, resetRequests: parsed.resetRequests ?? [] }
  } catch {
    return defaultPortalState()
  }
}

export function savePortalState(state: PortalState) {
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function isPositiveEnough(text: string) {
  const blocked = ['idiot', 'stupid', 'trash', 'garbage', 'hate you', 'kill yourself']
  const normalized = text.toLowerCase()
  return text.trim().length > 0 && !blocked.some((term) => normalized.includes(term))
}

export function defaultPassword(username: string) {
  return `${username}0205`
}
