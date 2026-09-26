import { describe, expect, it } from 'vitest'
import { journeyLevel, journeyProgress, makeMissions, planJourney, XP_RULES } from './progression'
import type { JourneyInput } from '../types'

const input: JourneyInput = {
  goal: 'Become a DJ',
  startingPoint: 'Complete beginner',
  hero: 'Perform a 25-minute live set',
  commitment: 'Four sessions per week',
  deadline: 'Five weeks',
  resources: 'Controller and headphones',
}

describe('journey progression', () => {
  it('creates a focused five-level path and initial missions', () => {
    const levels = planJourney(input)
    const missions = makeMissions(levels, input)
    expect(levels).toHaveLength(5)
    expect(levels[0].name).toMatch(/decks/i)
    expect(missions).toHaveLength(5)
    expect(missions.at(-1)?.type).toBe('BOSS')
    expect(missions.at(-1)?.proofRequired).toBe('video')
  })

  it('calculates progress and current level from completed missions', () => {
    const missions = makeMissions(planJourney(input), input)
    missions[0].completed = true
    missions[1].completed = true
    expect(journeyProgress(missions)).toBe(40)
    expect(journeyLevel(missions)).toBe(3)
  })

  it('keeps stronger proof bonuses centralized and ordered', () => {
    expect(XP_RULES.basic).toBeLessThan(XP_RULES.photo)
    expect(XP_RULES.photo).toBeLessThan(XP_RULES.video)
  })
})
