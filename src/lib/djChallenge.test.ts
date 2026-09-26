import { describe, expect, it } from 'vitest'
import { createDjChallenge, djChallengeMissions, upgradeDjChallenge } from './djChallenge'
import { currentJourneyLevel, journeyProgress } from './progression'

describe('30-day DJ challenge', () => {
  it('maps every day to a Level and keeps recording checkpoints', () => {
    const journey = createDjChallenge()
    expect(journey.missions).toHaveLength(33)
    expect(journey.levels).toHaveLength(5)
    expect(journey.missions.filter((mission) => mission.phase === 'lead-up')).toHaveLength(3)
    expect(journey.missions.filter((mission) => mission.phase === 'challenge').map((mission) => mission.day)).toEqual(Array.from({ length: 30 }, (_, i) => i + 1))
    expect(journey.missions.every((mission) => journey.levels.some((level) => level.id === mission.levelId))).toBe(true)
    expect(journey.missions.filter((mission) => mission.phase === 'challenge' && mission.proofRequired === 'video').map((mission) => mission.day)).toEqual([7, 14, 21, 28, 30])
    expect(journey.missions.at(-1)?.scheduledDate).toBe('2026-10-24')
  })

  it('advances Levels by the day grouping, not by each Mission', () => {
    const journey = createDjChallenge()
    expect(currentJourneyLevel(journey)).toBe(1)
    journey.missions.filter((mission) => mission.levelId === 'dj-foundations').forEach((mission) => { mission.completed = true })
    expect(currentJourneyLevel(journey)).toBe(2)
    expect(journeyProgress(journey.missions)).toBe(30)
  })

  it('keeps tutorial queries tied to each day', () => {
    expect(djChallengeMissions().every((mission) => mission.resourceQuery)).toBe(true)
  })

  it('reschedules for the October 25 show and preserves progress', () => {
    const journey = createDjChallenge('2026-10-24')
    journey.missions.find((mission) => mission.id === 'dj-day-1')!.completed = true
    const updated = upgradeDjChallenge(journey, '2026-10-25')
    expect(updated.missions.filter((mission) => mission.phase === 'lead-up')).toHaveLength(4)
    expect(updated.missions.find((mission) => mission.id === 'dj-day-1')?.completed).toBe(true)
    expect(updated.missions.at(-1)?.scheduledDate).toBe('2026-10-25')
  })
})
