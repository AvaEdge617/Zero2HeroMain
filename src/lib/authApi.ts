import type { AccountProgram, PortalAccount, PasswordResetRequest } from './portal'

const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? 'http://localhost:8787'
const REQUEST_TIMEOUT_MS = 12_000

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const response = await fetch(`${API_URL}${path}`, { ...options, signal: controller.signal, credentials: 'include', headers: { 'Content-Type': 'application/json', ...options.headers } })
    const body = await response.json().catch(() => ({})) as { error?: string } & T
    if (!response.ok) throw new Error(body.error ?? 'The server could not complete that request.')
    return body
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw new Error('The account service took too long to respond. Please try again.')
    throw error
  } finally {
    window.clearTimeout(timeout)
  }
}

export const authApi = {
  session: () => request<{ account: PortalAccount | null }>('/api/auth/session'),
  login: (username: string, password: string, program: AccountProgram) => request<{ account: PortalAccount }>('/api/auth/login', { method: 'POST', body: JSON.stringify({ username, password, program }) }),
  signup: (displayName: string, username: string, password: string, pin: string, program: AccountProgram, agreedToPositivity = false) => request<{ ok: true }>('/api/auth/signup', { method: 'POST', body: JSON.stringify({ displayName, username, password, pin, program, agreedToPositivity }) }),
  logout: () => request<{ ok: true }>('/api/auth/logout', { method: 'POST' }),
  finishFirstLogin: (password: string, pin: string) => request<{ ok: true }>('/api/auth/first-login', { method: 'POST', body: JSON.stringify({ password, pin }) }),
  requestReset: (username: string, pin: string, program: AccountProgram) => request<{ ok: true; message: string }>('/api/auth/reset-request', { method: 'POST', body: JSON.stringify({ username, pin, program }) }),
  founder: {
    list: () => request<{ accounts: PortalAccount[]; resetRequests: PasswordResetRequest[] }>('/api/founder/accounts'),
    accountAction: (id: string, action: 'approve' | 'decline' | 'delete' | 'reset') => request<{ ok: true }>(`/api/founder/accounts/${id}/${action}`, { method: 'POST' }),
    resetAction: (id: string, action: 'approve' | 'deny') => request<{ ok: true }>(`/api/founder/resets/${id}/${action}`, { method: 'POST' }),
  },
}
