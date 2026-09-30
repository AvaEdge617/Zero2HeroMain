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

  it('creates a complete 30-day business-launch challenge when requested', () => {
    const businessInput: JourneyInput = {
      goal: 'Open a community connections business for people with I/DD in Denver',
      startingPoint: 'Early research and local relationships',
      hero: 'Run an accessible first community-connection pilot and present its next-step plan',
      commitment: 'One focused task each day',
      deadline: '30 days',
      resources: 'Local contacts and a small startup budget',
    }
    const levels = planJourney(businessInput)
    const missions = makeMissions(levels, businessInput)

    expect(levels.map((level) => level.name)).toContain('Design a safe pilot')
    expect(missions).toHaveLength(30)
    expect(missions.map((mission) => mission.day)).toEqual(Array.from({ length: 30 }, (_, index) => index + 1))
    expect(missions.at(-1)).toMatchObject({ type: 'BOSS', proofRequired: 'video' })
    expect(missions.filter((mission) => mission.levelId === 'level-1')).toHaveLength(6)
    expect(missions.every((mission) => mission.description.includes('Deliverable:'))).toBe(true)
  })
})
