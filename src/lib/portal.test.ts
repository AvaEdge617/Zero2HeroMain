import { describe, expect, it } from 'vitest'
import { authenticate, defaultPassword, defaultPortalState, isPositiveEnough, pinPasses } from './portal'

describe('DJ portal', () => {
  it('seeds approved founder and user accounts', () => {
    const state = defaultPortalState()
    expect(authenticate(state.accounts, 'Onna', 'BuckNasty', 'zero2hero')?.role).toBe('founder')
    expect(authenticate(state.accounts, 'DJLucidSync', 'BuckNasty', 'your-shot')?.role).toBe('user')
    expect(authenticate(state.accounts, 'DJLucidSync', 'BuckNasty', 'zero2hero')).toBeUndefined()
  })

  it('does not authenticate pending accounts', () => {
    const state = defaultPortalState()
    state.accounts.push({ id: 'pending', username: 'NewDJ', displayName: 'New DJ', password: 'test', mustChangePassword: true, program: 'your-shot', role: 'user', status: 'pending', agreedToPositivity: true, createdAt: new Date().toISOString() })
    expect(authenticate(state.accounts, 'NewDJ', 'test')).toBeUndefined()
  })

  it('blocks clearly hostile feed language', () => {
    expect(isPositiveEnough('Try lowering the bass during that blend.')).toBe(true)
    expect(isPositiveEnough('This is trash.')).toBe(false)
  })

  it('creates the default password and checks a security PIN', () => {
    const account = defaultPortalState().accounts[0]
    expect(defaultPassword('NewDJ')).toBe('NewDJ0205')
    expect(pinPasses(account, '0205')).toBe(true)
    expect(pinPasses(account, '9999')).toBe(false)
  })
})
