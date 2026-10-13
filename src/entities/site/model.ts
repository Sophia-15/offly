import type { Tone } from '../../shared/ui/Tile'

export interface Site {
  id: string
  name: string
  tone: Tone
  ratePer5Min: number
  isCustom: boolean
}

export interface UnlockEntry {
  id: string
  siteId: string
  siteName: string
  minutes: number
  cost: number
  unlockedAt: string
}

export const DEFAULT_SITES: Site[] = [
  { id: 'tiktok', name: 'TikTok', tone: 'ink', ratePer5Min: 4, isCustom: false },
  { id: 'youtube', name: 'YouTube', tone: 'tangerine', ratePer5Min: 3, isCustom: false },
  { id: 'instagram', name: 'Instagram', tone: 'blue', ratePer5Min: 3, isCustom: false },
  { id: 'netflix', name: 'Netflix', tone: 'sun', ratePer5Min: 5, isCustom: false },
  { id: 'reddit', name: 'Reddit', tone: 'tangerine', ratePer5Min: 2, isCustom: false },
  { id: 'x', name: 'X', tone: 'ink', ratePer5Min: 3, isCustom: false },
  { id: 'twitch', name: 'Twitch', tone: 'blue', ratePer5Min: 4, isCustom: false },
]

export const UNLOCK_LENGTHS_MINUTES = [5, 15, 30, 60] as const

export function costFor(site: Site, minutes: number): number {
  return Math.round(site.ratePer5Min * (minutes / 5))
}
