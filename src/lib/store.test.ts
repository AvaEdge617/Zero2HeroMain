import { beforeEach, describe, expect, it } from 'vitest'
import { clearJourneys, loadJourneys, saveJourneys } from './store'
import type { Journey } from '../types'

const journey = (id: string, owner: string): Journey => ({
  id,
  owner,
  input: { goal: 'Photography', startingPoint: 'New', hero: 'Portrait', commitment: 'Weekly', deadline: '', resources: '' },
  levels: [],
  missions: [],
  proofs: [],
  rewardEvents: [],
  xp: 0,
  public: true,
  createdAt: '2026-09-30T00:00:00.000Z',
})

describe('account-scoped Journey storage', () => {
  beforeEach(() => localStorage.clear())

  it('keeps Journeys separated by authenticated account', () => {
    saveJourneys('account-a', [journey('a', 'A')])
    saveJourneys('account-b', [journey('b', 'B')])

    expect(loadJourneys('account-a').map((item) => item.id)).toEqual(['a'])
    expect(loadJourneys('account-b').map((item) => item.id)).toEqual(['b'])
    expect(loadJourneys('logged-out')).toEqual([])
  })

  it('clears only the selected account', () => {
    saveJourneys('account-a', [journey('a', 'A')])
    saveJourneys('account-b', [journey('b', 'B')])
    clearJourneys('account-a')

    expect(loadJourneys('account-a')).toEqual([])
    expect(loadJourneys('account-b')).toHaveLength(1)
  })
})
