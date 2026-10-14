import type { AlarmStyle } from '../../app/model/types'
import type { UnlockEntry } from '../../entities/site/model'

export type AlarmStage = 1 | 2 | 3

export const ALARM_MAX_STAGE: Record<AlarmStyle, AlarmStage> = { gentle: 1, persistent: 2, relentless: 3 }

export const ALARM_STAGE2_AFTER_SECONDS = 30
export const ALARM_STAGE3_AFTER_SECONDS = 60
export const ALARM_DRAIN_INTERVAL_SECONDS = 20
export const ALARM_SNOOZE_BASE_COST = 5
export const ALARM_SNOOZE_MINUTES: Record<AlarmStage, number> = { 1: 1, 2: 1, 3: 5 }
export const ALARM_DONE_BONUS = 2

export interface ActiveAlarm {
  unlock: UnlockEntry
  overBySeconds: number
  stage: AlarmStage
  drainedCoins: number
}

export function stageFor(overBySeconds: number, alarmStyle: AlarmStyle): AlarmStage {
  const raw: AlarmStage = overBySeconds >= ALARM_STAGE3_AFTER_SECONDS ? 3 : overBySeconds >= ALARM_STAGE2_AFTER_SECONDS ? 2 : 1
  return Math.min(raw, ALARM_MAX_STAGE[alarmStyle]) as AlarmStage
}

/** Coins the stage-3 takeover has drained so far — purely derived from timestamps (no
 *  separate persisted counter needed). Freezes at `dismissedAt` once the alarm is closed,
 *  so real time passing afterwards doesn't keep draining a session that's already over. */
export function drainedCoinsFor(unlock: UnlockEntry, alarmStyle: AlarmStyle, now: number): number {
  if (ALARM_MAX_STAGE[alarmStyle] < 3) return 0
  const endsAt = new Date(unlock.unlockedAt).getTime() + unlock.minutes * 60_000
  const referenceTime = unlock.dismissedAt ? new Date(unlock.dismissedAt).getTime() : now
  const overBySeconds = (referenceTime - endsAt) / 1000
  if (overBySeconds < ALARM_STAGE3_AFTER_SECONDS) return 0
  return Math.floor((overBySeconds - ALARM_STAGE3_AFTER_SECONDS) / ALARM_DRAIN_INTERVAL_SECONDS) + 1
}

export function findActiveAlarm(unlocks: UnlockEntry[], alarmStyle: AlarmStyle, now: number): ActiveAlarm | null {
  let best: ActiveAlarm | null = null
  for (const unlock of unlocks) {
    if (unlock.dismissedAt) continue
    const endsAt = new Date(unlock.unlockedAt).getTime() + unlock.minutes * 60_000
    const overBySeconds = (now - endsAt) / 1000
    if (overBySeconds < 0) continue
    const stage = stageFor(overBySeconds, alarmStyle)
    if (!best || overBySeconds > best.overBySeconds) best = { unlock, overBySeconds, stage, drainedCoins: drainedCoinsFor(unlock, alarmStyle, now) }
  }
  return best
}

export function fmtOver(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${r < 10 ? '0' : ''}${r}`
}
