import type { Journey } from '../types'

const keyFor = (accountId: string) => `zero2hero.journeys.v2.${accountId}`

export function loadJourneys(accountId: string): Journey[] {
  try {
    const value = localStorage.getItem(keyFor(accountId))
    return value ? JSON.parse(value) as Journey[] : []
  } catch {
    return []
  }
}

export function saveJourneys(accountId: string, journeys: Journey[]) {
  localStorage.setItem(keyFor(accountId), JSON.stringify(journeys))
}

export function clearJourneys(accountId: string) {
  localStorage.removeItem(keyFor(accountId))
}
