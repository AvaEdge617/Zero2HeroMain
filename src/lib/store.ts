import type { Journey } from '../types'

const KEY = 'zero2hero.journeys.v1'

export function loadJourneys(): Journey[] {
  try {
    const value = localStorage.getItem(KEY)
    return value ? JSON.parse(value) as Journey[] : []
  } catch {
    return []
  }
}

export function saveJourneys(journeys: Journey[]) {
  localStorage.setItem(KEY, JSON.stringify(journeys))
}

export function clearJourneys() {
  localStorage.removeItem(KEY)
}
