import { describe, expect, it } from 'vitest'
import { defaultPassword, defaultPortalState, isPositiveEnough } from './portal'

describe('DJ portal', () => {
  it('does not seed credentials into browser storage', () => {
    const state = defaultPortalState()
    expect(state.accounts).toEqual([])
    expect(JSON.stringify(state)).not.toContain('password')
  })

  it('blocks clearly hostile feed language', () => {
    expect(isPositiveEnough('Try lowering the bass during that blend.')).toBe(true)
    expect(isPositiveEnough('This is trash.')).toBe(false)
  })

  it('creates the temporary password format without persisting it', () => {
    expect(defaultPassword('NewDJ')).toBe('NewDJ0205')
  })
})
