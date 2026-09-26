import type { Journey, JourneyInput, JourneyLevel, Mission, MissionType, ProofType } from '../types'

export const DJ_CHALLENGE_ID = 'your-shot-dj-30' as const
export const DJ_CHALLENGE_VERSION = 2
export const DJ_LEAD_UP_START = '2026-09-22'
export const DJ_PERFORMANCE_DATES = ['2026-10-24', '2026-10-25'] as const
export type DjPerformanceDate = typeof DJ_PERFORMANCE_DATES[number]

export const djChallengeInput: JourneyInput = {
  goal: 'DJ',
  startingPoint: 'Learning the fundamentals',
  hero: 'Perform a confident live DJ set at Your Shot',
  commitment: '45–90 minutes per day from September 22 through show day',
  deadline: 'Choose October 24 or October 25, 2026',
  resources: 'DJ controller or decks, headphones, Rekordbox, music library, and USB drive',
}

export const djChallengeLevels: JourneyLevel[] = [
  { id: 'dj-foundations', name: 'Foundations', description: 'Equipment, music basics, and first beatmatch.' },
  { id: 'dj-beatmatching', name: 'Beatmatching', description: 'Control tempo, cueing, and clean starts.' },
  { id: 'dj-phrasing', name: 'Phrasing & preparation', description: 'Prepare tracks, cues, and phrase-aware transitions.' },
  { id: 'dj-mixing', name: 'Cleaner mixing', description: 'Use EQ, loops, monitors, and energy flow.' },
  { id: 'dj-performance', name: 'Performance', description: 'Refine, rehearse, and record a complete set.' },
]

type Day = [string, string, string, MissionType?, ProofType?]

const leadUpDays: Day[] = [
  ['Confirm your show target', 'Write down your selected performance date, assigned set length, and the kind of energy you want the room to feel.', 'how to set goals for first DJ performance'],
  ['Audit your DJ setup', 'List the controller or decks, laptop, headphones, cables, Rekordbox access, and USB drives you have. Flag anything you need to borrow or replace.', 'beginner DJ equipment checklist'],
  ['Map the Your Shot course', 'Review your Your Shot lesson schedule and add every class, coaching session, and practice window to your calendar.', 'DJ practice schedule beginner'],
  ['Choose your sound', 'Write a one-sentence direction for the set and select three reference mixes or artists that match it.', 'how to define your DJ style'],
  ['Start music discovery', 'Collect 15 possible tracks that fit your sound. Favor music you understand and would be excited to play live.', 'DJ music discovery build a set'],
  ['Clean your music library', 'Create folders for candidates, practice tracks, and show tracks. Correct titles, artists, genres, and missing artwork.', 'Rekordbox organize music library beginner'],
  ['Build a lead-up crate', 'Grow the candidate pool to at least 30 tracks and note the likely opening, peak, and closing options.', 'Rekordbox prepare DJ playlist beginner'],
  ['Prepare your practice space', 'Set up a repeatable place to practice, test the audio path, and choose where your recordings will be saved.', 'home DJ practice setup beginner'],
  ['Record your baseline', 'Record five minutes of whatever you can do today. Keep it as your honest Zero so you can compare it with show day.', 'record DJ mix Rekordbox beginner', 'DEMONSTRATE', 'video'],
]

const days: Day[] = [
  ['Set up your DJ station', 'Connect your decks or controller and headphones. Install Rekordbox and confirm audio, cue, and browsing work.', 'XDJ-RX3 beginner equipment overview'],
  ['Learn the deck controls', 'Practice play/pause, cue, jog wheels, tempo, pads, and library browsing. Find each control without looking at a guide.', 'XDJ-RX3 beginner equipment overview'],
  ['Learn the mixer', 'Locate channel faders, crossfader, HI/MID/LOW EQ, and headphone cue. Practice bringing a channel in and out.', 'DJ headphone cueing channel fader EQ beginner'],
  ['Build a 20-track starter crate', 'Collect at least 20 songs on a USB or in Rekordbox and analyze every track.', 'Rekordbox beginner import analyze music', 'CREATE'],
  ['Count beats and bars', 'Learn BPM, beats, bars, and downbeats. Count along with 10 songs and identify each first beat.', 'DJ music basics BPM bars beats downbeat beginner'],
  ['Start on the phrase', 'Find the first downbeat and launch tracks at a phrase boundary. Repeat until the start feels natural.', 'DJ mixing on the downbeat tutorial'],
  ['First beatmatch recording', 'Beatmatch two similar-BPM tracks manually and record a 10-minute practice mix.', 'DJ beatmatching by ear beginner tutorial', 'BOSS', 'video'],
  ['Fixed-tempo beatmatching', 'Repeat the beatmatch drill using loops and fixed BPM, focusing on listening rather than the display.', 'DJ beatmatching same BPM practice'],
  ['Correct drift with jogs', 'Use jog wheels to nudge a drifting track back into time without stopping either deck.', 'DJ beatmatching jog wheel tutorial'],
  ['Fifteen clean starts', 'Launch an incoming track on the downbeat 15 times; count the starts that stay aligned.', 'DJ mixing on the downbeat tutorial'],
  ['Mix different BPMs', 'Use small tempo adjustments to blend tracks with slightly different BPMs.', 'DJ mixing different BPMs tutorial'],
  ['Headphone cue drill', 'Cue the incoming track and identify whether it is ahead or behind before touching the jog.', 'DJ ear training beatmatching exercises'],
  ['Fader transition drill', 'Practice channel-fader transitions while balancing master and headphone cue.', 'DJ headphone cueing channel fader tutorial'],
  ['Record a 15-minute mix', 'Make a continuous 15-minute mix focused on clean beatmatching and listen back for timing errors.', 'how to record a DJ mix at home', 'BOSS', 'video'],
  ['Prepare your Rekordbox crate', 'Review Rekordbox training resources; re-analyze tracks, fix metadata, and organize the crate.', 'Rekordbox beginner setup import analyze music', 'CREATE'],
  ['Set cue points', 'Place memory cues or hot cues at intros, drops, and mix-out points in your practice tracks.', 'Rekordbox cue points hot cues beginner'],
  ['Map song structure', 'Identify intro, build, drop, breakdown, and outro in 10 tracks. Note useful transition points.', 'DJ song structure intro verse chorus breakdown outro'],
  ['Mix in phrases', 'Bring Track B in on 16- or 32-bar boundaries and listen for sections changing together.', 'DJ phrase mixing beginner tutorial'],
  ['Practice advanced phrasing', 'Pair tracks with different arrangements and choose a musical entry point for each transition.', 'DJ advanced phrasing 16 32 bar mixing'],
  ['Build energy playlists', 'Organize warm-up, lift, peak, and closing tracks so the set has a deliberate arc.', 'Rekordbox prepare DJ playlist cue points beginner', 'CREATE'],
  ['Record a phrase-mixed set', 'Record a continuous 20-minute set using prepared cues and phrase-aware transitions.', 'how to rehearse a DJ set', 'BOSS', 'video'],
  ['Prevent bass clashes', 'Trade LOW EQ between outgoing and incoming tracks; record examples that sound clean and muddy.', 'DJ EQ mixing avoid bass clash'],
  ['Shape with HI and MID', 'Practice subtle HI/MID EQ moves and smooth channel-fader movement.', 'DJ EQ mixing beginner HI MID LOW'],
  ['Mix with booth monitors', 'Use booth monitors and practice checking the room sound with one ear off the headphones.', 'DJ booth monitor how to use tutorial'],
  ['Use loops with purpose', 'Extend an intro or outro with a loop and recover from a transition that starts too late.', 'DJ looping beginner tutorial'],
  ['Build the full set', 'Arrange a 30–40 minute set with a deliberate opening, lift, peak, and closing sequence.', 'how to plan a DJ set energy flow', 'CREATE'],
  ['Add restrained FX', 'Try one effect at a time only where it supports a transition; leave clean sections untouched.', 'how to use DJ effects tastefully'],
  ['Record and review', 'Record the full set. Listen back and write down three specific fixes for timing, EQ, or song choice.', 'DJ mix feedback checklist beatmatching EQ phrasing', 'BOSS', 'video'],
  ['Final rehearsal and show prep', 'Run the set once without stopping. Export and test your main USB and backup, confirm cue points, then pack headphones, adapters, and your show-day essentials.', 'DJ performance day preparation USB backup checklist', 'DEMONSTRATE'],
  ['Your Shot performance', 'Play your Your Shot set at the assigned length. Capture a video clip if permitted and compare it with your first recording.', 'DJ live performance confidence stage presence', 'BOSS', 'video'],
]

function dateFrom(start: string, offset: number) {
  const date = new Date(`${start}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + offset)
  return date.toISOString().slice(0, 10)
}

function challengeStart(performanceDate: DjPerformanceDate) {
  return dateFrom(performanceDate, -29)
}

function leadUpCount(performanceDate: DjPerformanceDate) {
  const start = new Date(`${DJ_LEAD_UP_START}T12:00:00Z`)
  const challenge = new Date(`${challengeStart(performanceDate)}T12:00:00Z`)
  return Math.max(0, Math.round((challenge.getTime() - start.getTime()) / 86_400_000))
}

export function djChallengeMissions(performanceDate: DjPerformanceDate = DJ_PERFORMANCE_DATES[0]): Mission[] {
  const leadUp = leadUpDays.slice(0, leadUpCount(performanceDate)).map(([title, description, resourceQuery, type, proofRequired], index) => ({
    id: `dj-leadup-${index + 1}`,
    levelId: djChallengeLevels[0].id,
    phase: 'lead-up' as const,
    scheduledDate: dateFrom(DJ_LEAD_UP_START, index),
    type: type ?? 'PRACTICE',
    title,
    description: index === 0 ? `Write down the ${formatMissionDate(performanceDate)}, 2026 performance date, your assigned set length, and the kind of energy you want the room to feel.` : description,
    resourceQuery,
    xp: type === 'BOSS' ? 100 : 50,
    proofRequired: proofRequired ?? 'basic',
    completed: false,
  }))
  const challenge = days.map(([title, description, resourceQuery, type, proofRequired], index) => ({
    id: `dj-day-${index + 1}`,
    levelId: djChallengeLevels[Math.min(4, Math.floor(index / 7))].id,
    day: index + 1,
    phase: 'challenge' as const,
    scheduledDate: dateFrom(challengeStart(performanceDate), index),
    type: type ?? 'PRACTICE',
    title,
    description,
    resourceQuery,
    xp: type === 'BOSS' ? 100 : 50,
    proofRequired: proofRequired ?? 'basic',
    completed: false,
  }))
  return [...leadUp, ...challenge]
}

export function createDjChallenge(performanceDate: DjPerformanceDate = DJ_PERFORMANCE_DATES[0]): Journey {
  const performanceLabel = formatMissionDate(performanceDate)
  return {
    id: crypto.randomUUID(),
    templateId: DJ_CHALLENGE_ID,
    templateVersion: DJ_CHALLENGE_VERSION,
    owner: 'Onna',
    input: { ...djChallengeInput, hero: `Perform a confident live DJ set at Your Shot on ${performanceLabel}, 2026`, deadline: `${performanceLabel}, 2026` },
    levels: djChallengeLevels.map((level) => ({ ...level })),
    missions: djChallengeMissions(performanceDate),
    proofs: [],
    rewardEvents: [],
    xp: 0,
    public: true,
    createdAt: new Date().toISOString(),
  }
}

export function upgradeDjChallenge(journey: Journey, requestedDate?: DjPerformanceDate): Journey {
  if (journey.templateId !== DJ_CHALLENGE_ID) return journey
  const performanceDate = requestedDate ?? (journey.input.deadline.includes('Oct 25') ? DJ_PERFORMANCE_DATES[1] : DJ_PERFORMANCE_DATES[0])
  const previous = new Map(journey.missions.map((mission) => [mission.id, mission]))
  const performanceLabel = formatMissionDate(performanceDate)
  return {
    ...journey,
    templateVersion: DJ_CHALLENGE_VERSION,
    input: { ...djChallengeInput, hero: `Perform a confident live DJ set at Your Shot on ${performanceLabel}, 2026`, deadline: `${performanceLabel}, 2026` },
    levels: djChallengeLevels.map((level) => ({ ...level })),
    missions: djChallengeMissions(performanceDate).map((mission) => ({ ...mission, completed: previous.get(mission.id)?.completed ?? false })),
  }
}

export function formatMissionDate(date: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`))
}

export function djResourceUrl(query: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
}
