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
  ['Write the purpose and community promise', 'Write a one-page statement naming the Denver community you will serve, the type of connection you will create, and the change participants should feel. Deliverable: a dated purpose statement with one sentence you can say to a potential partner.', 'PRACTICE', 'basic'],
  ['List the assumptions to test', 'List at least 10 assumptions about needs, transportation, support, cost, venue access, and interest. Deliverable: a ranked question list marked “must learn before pilot.”', 'PRACTICE', 'basic'],
  ['Map the Denver support ecosystem', 'Find at least 12 local self-advocacy groups, providers, community spaces, and referral partners relevant to the first offer. Deliverable: a contact sheet with organization, contact route, role, and why it could help.', 'CREATE', 'photo'],
  ['Schedule three listening conversations', 'Invite three people with lived experience, family members, or trusted supporters to 20-minute listening conversations. Deliverable: three calendar invitations or written confirmations.', 'DEMONSTRATE', 'basic'],
  ['Run the first listening conversation', 'Ask what makes connection difficult, what support is useful, what feels respectful, and what would make someone want to return. Deliverable: anonymized notes with three direct needs or strengths.', 'DEMONSTRATE', 'basic'],
  ['Synthesize what you heard', 'Compare all completed conversation notes and identify repeated themes. Deliverable: a one-page summary with one focused problem the first pilot will solve and evidence for choosing it.', 'CREATE', 'photo'],
  ['Choose a narrow first audience', 'Define one first participant group, one Denver area or access method, and one type of connection. Deliverable: a 50-word audience statement that excludes people or needs the pilot cannot responsibly support yet.', 'PRACTICE', 'basic'],
  ['Draft the pilot experience', 'Create a timed outline for one small session: welcome, connection activity, breaks, support, transition, and closing. Deliverable: a run-of-show with owner and duration for every step.', 'CREATE', 'photo'],
  ['Ask for accessibility feedback', 'Review the run-of-show with a person with lived experience and ask about language, pace, sensory needs, transportation, and communication access. Deliverable: a change log showing at least three decisions or the reason no change was needed.', 'DEMONSTRATE', 'basic'],
  ['Research local requirements', 'Create a question list for Colorado and Denver licensing, insurance, background checks, transportation, and provider requirements. Do not guess at legal requirements. Deliverable: a list of questions, source links, and the qualified people you will consult before operating.', 'PRACTICE', 'basic'],
  ['Set safety and consent boundaries', 'Draft plain-language rules for privacy, consent, emergencies, support needs, photos, and when to refer someone elsewhere. Deliverable: a one-page participant safety and consent draft.', 'CREATE', 'photo'],
  ['Define the pilot offer', 'Write who the pilot is for, what happens, accessibility supports, duration, price or funding approach, contact method, and what is not included. Deliverable: a one-page offer that a partner can share unchanged.', 'CREATE', 'photo'],
  ['Build a starter budget', 'List fixed costs, per-participant costs, partner contributions, and a conservative first-month target. Deliverable: a simple budget with best-case, expected, and stop-loss amounts.', 'PRACTICE', 'basic'],
  ['Name the business and message', 'Choose a working name and write a plain-language invitation that centers participants rather than services. Deliverable: a name, 30-word promise, and 100-word invitation.', 'CREATE', 'photo'],
  ['Make a simple interest form', 'Create an accessible form that lets someone express interest, request an accommodation, choose a contact method, or ask for a conversation. Deliverable: a working form tested by one other person.', 'CREATE', 'photo'],
  ['Prepare a partner introduction', 'Write a concise email and one-page handout for groups that may refer, host, or collaborate. Deliverable: one email template and one partner handout with a clear ask.', 'PRACTICE', 'basic'],
  ['Contact the first five partners', 'Send personalized outreach to five aligned Denver organizations or community leaders. Deliverable: an outreach log with date, contact, message, and follow-up date for each.', 'DEMONSTRATE', 'basic'],
  ['Follow up with interested partners', 'Hold at least one conversation about a safe partnership, referral route, or pilot venue. Deliverable: meeting notes that state the agreed next action, owner, and deadline.', 'DEMONSTRATE', 'basic'],
  ['Choose a pilot date and venue', 'Confirm an accessible in-person or virtual format only after checking the support and safety needs identified so far. Deliverable: a confirmed date, location or platform, access notes, and backup option.', 'CREATE', 'photo'],
  ['Create the participant welcome', 'Prepare plain-language expectations, what to bring, contact details, consent options, schedule, and accommodation questions. Deliverable: a participant welcome packet ready to send.', 'CREATE', 'photo'],
  ['Complete a launch-readiness review', 'Review the complete pilot plan with an advisor or qualified professional for safety, permissions, insurance, accessibility, and operational gaps. Deliverable: a signed-off checklist or a documented list of unresolved blockers.', 'DEMONSTRATE', 'basic'],
  ['Invite the first participants', 'Share the pilot invitation through trusted channels and maintain a respectful interest list without unnecessary personal data. Deliverable: the sent invitation and an interest list with consented contact details only.', 'DEMONSTRATE', 'basic'],
  ['Confirm accommodations and support', 'Contact interested participants using their preferred method to understand access needs and confirm what the pilot can provide. Deliverable: an anonymized accommodation checklist and any changes to the run-of-show.', 'PRACTICE', 'basic'],
  ['Rehearse the pilot', 'Run the welcome, activity, transitions, support plan, and closing with a trusted helper. Deliverable: a short rehearsal recording and a list of changes before the live pilot.', 'DEMONSTRATE', 'video'],
  ['Prepare feedback questions', 'Make an accessible feedback method with no more than five questions about safety, belonging, usefulness, and improvements. Deliverable: a ready-to-use paper, digital, or conversation-based feedback script.', 'CREATE', 'photo'],
  ['Run the first pilot session', 'Facilitate the session, follow the agreed boundaries, and record only proof that every person has consented to share. Deliverable: a completed run-of-show, attendance count, and consented proof of work.', 'DEMONSTRATE', 'video'],
  ['Collect participant feedback', 'Gather feedback in the format participants prefer and thank everyone for their time. Deliverable: anonymized responses grouped into what worked, what did not, and requested changes.', 'DEMONSTRATE', 'basic'],
  ['Review results with advisors', 'Compare the pilot outcome with the original promise and review the findings with an advisor or partner. Deliverable: a decision memo stating continue, revise, pause, or stop and why.', 'CREATE', 'photo'],
  ['Publish the next-step plan', 'Write the next 30-day plan covering partnerships, operations, funding, and the next pilot date. Deliverable: a one-page plan with dates, owners, and the first three actions.', 'CREATE', 'photo'],
  ['Boss Mission: present the pilot launch', 'Present the purpose, pilot results, participant feedback themes, safety learnings, and responsible next step to an advisor or partner. Deliverable: a 5–10 minute video presentation and the decision you are asking for.', 'BOSS', 'video'],
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
