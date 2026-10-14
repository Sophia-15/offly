import { DEFAULT_SITES } from '../../entities/site/model'
import { DEFAULT_TASKS } from '../../entities/task/model'
import type { AppState } from '../../app/model/types'

const STORAGE_KEY = 'offly:v1'

function defaultState(): AppState {
  return {
    tasks: DEFAULT_TASKS,
    completions: [],
    sites: DEFAULT_SITES,
    unlocks: [],
    buddyId: 'sun',
    displayName: '',
    theme: 'system',
    language: 'en',
    hiddenTaskIds: [],
    alarmStyle: 'relentless',
    notifyEnabled: false,
  }
}

function isAppState(value: unknown): value is Partial<AppState> {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return Array.isArray(v.tasks) && Array.isArray(v.completions) && Array.isArray(v.sites) && Array.isArray(v.unlocks)
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed: unknown = JSON.parse(raw)
    // Merge over defaults so fields added after someone's first save (like
    // displayName/theme) fill in instead of resetting their whole backup.
    return isAppState(parsed) ? { ...defaultState(), ...parsed } : defaultState()
  } catch {
    return defaultState()
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function exportState(state: AppState): void {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const date = new Date().toISOString().slice(0, 10)
  a.href = url
  a.download = `offly-backup-${date}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function parseImportedState(json: string): AppState {
  const parsed: unknown = JSON.parse(json)
  if (!isAppState(parsed)) {
    throw new Error('That file does not look like an Offly backup.')
  }
  return { ...defaultState(), ...parsed }
}
