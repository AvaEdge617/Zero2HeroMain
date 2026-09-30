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
  business: [
    ['Listen and define the need', 'Learn from the people the business is meant to serve and define a focused first offer.'],
    ['Design a safe pilot', 'Turn the idea into a practical, accessible pilot with clear boundaries and support.'],
    ['Build the operating foundation', 'Create the basic policies, budget, partnerships, and tools needed to run the pilot.'],
    ['Invite the first community', 'Share the offer, gather interest, and prepare the first participants and partners.'],
    ['Run and prove the launch', 'Deliver the pilot, collect feedback, and decide the next responsible step.'],
  ],
  default: [
    ['Learn the landscape', 'Understand the tools, language, and first principles.'],
    ['Build the foundation', 'Practice the smallest essential skills.'],
    ['Combine the skills', 'Use the fundamentals together in a real attempt.'],
    ['Create a complete result', 'Produce a full version of the target outcome.'],
    ['Prove it under pressure', 'Demonstrate the Hero outcome in real conditions.'],
  ],
}

const isBusinessJourney = (input: JourneyInput) => /business|company|service|organization|venture/i.test(`${input.goal} ${input.hero}`)

export function planJourney(input: JourneyInput): JourneyLevel[] {
  const subject = `${input.goal} ${input.hero}`
  const key = /dj|mix|rekordbox/i.test(subject)
    ? 'dj'
    : isBusinessJourney(input) ? 'business'
      : /run|fitness|workout|5k|gym/i.test(subject) ? 'fitness' : 'default'
  return templates[key].map(([name, description], index) => ({ id: `level-${index + 1}`, name, description }))
}

const categoryFor = (index: number): MissionType => (['PRACTICE', 'DEMONSTRATE', 'CREATE', 'PRACTICE', 'BOSS'] as MissionType[])[index]

export function makeMissions(levels: JourneyLevel[], input: JourneyInput): Mission[] {
  if (/\b30[ -]?days?\b/i.test(input.deadline) && isBusinessJourney(input)) return makeThirtyDayBusinessMissions(levels)
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

const businessDays: Array<[string, string, MissionType, ProofType]> = [
  ['Write the purpose and community promise', 'Describe the community connection you want to create, who it serves, and the change people should experience.', 'PRACTICE', 'basic'],
  ['List the assumptions to test', 'Write the questions you need people with lived experience, families, and local partners to answer before you build.', 'PRACTICE', 'basic'],
  ['Map the Denver support ecosystem', 'Identify local self-advocacy groups, providers, community spaces, and referral partners relevant to the first offer.', 'CREATE', 'photo'],
  ['Schedule three listening conversations', 'Invite people with lived experience and trusted supporters to short paid or respectful listening conversations.', 'DEMONSTRATE', 'basic'],
  ['Run the first listening conversation', 'Listen for needs, strengths, accessibility barriers, and what a useful connection would look like.', 'DEMONSTRATE', 'basic'],
  ['Synthesize what you heard', 'Write the strongest patterns and one focused problem the first pilot will solve.', 'CREATE', 'photo'],
  ['Choose a narrow first audience', 'Define the first group, location, and type of connection the pilot will support.', 'PRACTICE', 'basic'],
  ['Draft the pilot experience', 'Outline the beginning, activity, support, and ending of one small community-connection session.', 'CREATE', 'photo'],
  ['Ask for accessibility feedback', 'Review the draft with a person with lived experience and capture the changes they request.', 'DEMONSTRATE', 'basic'],
  ['Research local requirements', 'Make a question list for Colorado and Denver licensing, insurance, background checks, transportation, and provider requirements. Get qualified advice before operating.', 'PRACTICE', 'basic'],
  ['Set safety and consent boundaries', 'Draft plain-language rules for privacy, consent, emergencies, support needs, and when to refer someone elsewhere.', 'CREATE', 'photo'],
  ['Define the pilot offer', 'Write a one-page description with who it is for, what happens, accessibility supports, price or funding approach, and what is not included.', 'CREATE', 'photo'],
  ['Build a starter budget', 'List realistic launch costs, participant costs, partner contributions, and a conservative first-month target.', 'PRACTICE', 'basic'],
  ['Name the business and message', 'Choose a working name and write a short invitation that centers participants and community connection.', 'CREATE', 'photo'],
  ['Make a simple interest form', 'Create an accessible way for people to express interest, request an accommodation, or ask for a conversation.', 'CREATE', 'photo'],
  ['Prepare a partner introduction', 'Write a concise email or handout for organizations that may refer, host, or collaborate on the pilot.', 'PRACTICE', 'basic'],
  ['Contact the first five partners', 'Send personalized outreach to five aligned Denver organizations or community leaders.', 'DEMONSTRATE', 'basic'],
  ['Follow up with interested partners', 'Hold at least one conversation about a safe, useful partnership or pilot venue.', 'DEMONSTRATE', 'basic'],
  ['Choose a pilot date and venue', 'Select an accessible format, date, and venue or virtual option after confirming support and safety needs.', 'CREATE', 'photo'],
  ['Create the participant welcome', 'Prepare plain-language expectations, what to bring, contact details, consent options, and accommodation questions.', 'CREATE', 'photo'],
  ['Complete a launch-readiness review', 'Check the pilot plan with an advisor or qualified professional for gaps in safety, permissions, and accessibility.', 'DEMONSTRATE', 'basic'],
  ['Invite the first participants', 'Share the pilot invitation through trusted channels and keep a respectful interest list.', 'DEMONSTRATE', 'basic'],
  ['Confirm accommodations and support', 'Contact interested participants to understand access needs and confirm what the pilot can provide.', 'PRACTICE', 'basic'],
  ['Rehearse the pilot', 'Run through the welcome, activity, transitions, and closing with a trusted helper.', 'DEMONSTRATE', 'video'],
  ['Prepare feedback questions', 'Create a short, accessible feedback method that asks what worked, what did not, and what should change.', 'CREATE', 'photo'],
  ['Run the first pilot session', 'Facilitate the community-connection session, follow the agreed boundaries, and document only consented proof of work.', 'DEMONSTRATE', 'video'],
  ['Collect participant feedback', 'Gather feedback in the format participants prefer and thank everyone for their time.', 'DEMONSTRATE', 'basic'],
  ['Review results with advisors', 'Compare the pilot outcome with the original promise and identify changes before offering another session.', 'CREATE', 'photo'],
  ['Publish the next-step plan', 'Write the next 30-day plan, including partnerships, operations, funding, and the next pilot date.', 'CREATE', 'photo'],
  ['Boss Mission: present the pilot launch', 'Present the purpose, pilot results, participant feedback themes, and responsible next step to an advisor or partner.', 'BOSS', 'video'],
]

function makeThirtyDayBusinessMissions(levels: JourneyLevel[]): Mission[] {
  return businessDays.map(([title, description, type, proofRequired], index) => ({
    id: `day-${index + 1}`,
    levelId: levels[Math.min(Math.floor(index / 6), levels.length - 1)]?.id ?? `level-${Math.floor(index / 6) + 1}`,
    type,
    title,
    description,
    xp: type === 'BOSS' ? 100 : 50,
    proofRequired,
    completed: false,
    day: index + 1,
    phase: 'challenge',
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
