import type { Journey, JourneyInput, JourneyLevel, Mission, MissionType, ProofType } from '../types'

export const XP_RULES: Record<ProofType, number> = { basic: 20, photo: 35, video: 55 }

const templates: Record<string, Array<[string, string]>> = {
  dj: [
    ['Understand the decks', 'Learn the controls, phrasing, and track structure.'],
    ['Control two tracks', 'Prepare music and keep two tracks aligned.'],
    ['Create clean transitions', 'Move between tracks with control and intention.'],
    ['Build a complete set', 'Shape an opening, arc, and finish.'],
    ['Perform under pressure', 'Deliver the set continuously and confidently.'],
  ],
  fitness: [
    ['Build the baseline', 'Measure the starting point and establish safe form.'],
    ['Create consistency', 'Complete repeatable sessions each week.'],
    ['Increase capacity', 'Add difficulty without losing technique.'],
    ['Test the skill', 'Complete a meaningful practice benchmark.'],
    ['Deliver the Hero outcome', 'Complete the goal under real conditions.'],
  ],
  default: [
    ['Learn the landscape', 'Understand the tools, language, and first principles.'],
    ['Build the foundation', 'Practice the smallest essential skills.'],
    ['Combine the skills', 'Use the fundamentals together in a real attempt.'],
    ['Create a complete result', 'Produce a full version of the target outcome.'],
    ['Prove it under pressure', 'Demonstrate the Hero outcome in real conditions.'],
  ],
}

export function planJourney(input: JourneyInput): JourneyLevel[] {
  const key = /dj|mix|rekordbox/i.test(`${input.goal} ${input.hero}`)
    ? 'dj'
    : /run|fitness|workout|5k|gym/i.test(`${input.goal} ${input.hero}`) ? 'fitness' : 'default'
  return templates[key].map(([name, description], index) => ({ id: `level-${index + 1}`, name, description }))
}

const categoryFor = (index: number): MissionType => (['PRACTICE', 'DEMONSTRATE', 'CREATE', 'PRACTICE', 'BOSS'] as MissionType[])[index]

export function makeMissions(levels: JourneyLevel[], input: JourneyInput): Mission[] {
  return levels.map((level, index) => ({
    id: `mission-${index + 1}`,
    levelId: level.id,
    type: categoryFor(index),
    title: index === 0 ? `Complete your first ${input.goal} practice` : index === 4 ? `Demonstrate: ${input.hero}` : level.name,
    description: index === 0
      ? `Spend one focused session on “${level.description}” and record what you learned.`
      : index === 4 ? 'Complete the outcome in one continuous attempt and submit video proof.' : level.description,
    xp: index === 4 ? 100 : 50,
    proofRequired: index === 4 ? 'video' : index === 1 ? 'photo' : 'basic',
    completed: false,
  }))
}

export const journeyProgress = (missions: Mission[]) =>
  missions.length ? Math.round((missions.filter((mission) => mission.completed).length / missions.length) * 100) : 0

export const journeyLevel = (missions: Mission[]) => Math.min(missions.length, missions.filter((mission) => mission.completed).length + 1)

export function currentJourneyLevel(journey: Journey): number {
  const nextMission = journey.missions.find((mission) => !mission.completed)
  if (!nextMission) return journey.levels.length
  const index = journey.levels.findIndex((level) => level.id === nextMission.levelId)
  return index >= 0 ? index + 1 : 1
}
