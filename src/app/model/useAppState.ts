import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Task } from '../../entities/task/model'
import { costFor, type Site } from '../../entities/site/model'
import { ALARM_DONE_BONUS, ALARM_SNOOZE_BASE_COST, drainedCoinsFor, findActiveAlarm } from '../../features/times-up/model'
import { randomId } from '../../shared/lib/id'
import { computeStreakStats, computeWeek } from '../../shared/lib/streak'
import { exportState, loadState, parseImportedState, saveState } from '../../shared/lib/storage'
import type { AlarmStyle, AppState, Theme } from './types'

const TICK_MS = 1000

export function useAppState() {
  const [state, setState] = useState<AppState>(() => loadState())
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    saveState(state)
  }, [state])

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), TICK_MS)
    return () => clearInterval(id)
  }, [])

  const balance = useMemo(() => {
    const earned = state.completions.reduce((sum, c) => sum + c.points, 0)
    const earnedBonuses = state.unlocks.reduce((sum, u) => sum + (u.bonusCoins ?? 0), 0)
    const spent = state.unlocks.reduce((sum, u) => sum + u.cost + drainedCoinsFor(u, state.alarmStyle, now) + (u.snoozeSpent ?? 0), 0)
    return Math.max(0, earned + earnedBonuses - spent)
  }, [state.completions, state.unlocks, state.alarmStyle, now])

  const streak = useMemo(() => computeStreakStats(state.completions), [state.completions])
  const week = useMemo(() => computeWeek(state.completions), [state.completions])

  const openUnlocks = useMemo(() => {
    return state.unlocks
      .map((u) => {
        const endsAt = new Date(u.unlockedAt).getTime() + u.minutes * 60_000
        const remainingSeconds = Math.round((endsAt - now) / 1000)
        return { ...u, remainingSeconds }
      })
      .filter((u) => u.remainingSeconds > 0)
  }, [state.unlocks, now])

  const activeAlarm = useMemo(() => findActiveAlarm(state.unlocks, state.alarmStyle, now), [state.unlocks, state.alarmStyle, now])

  const completeTask = useCallback((task: Task) => {
    setState((prev) => ({
      ...prev,
      completions: [
        {
          id: randomId(),
          taskId: task.id,
          taskName: task.name,
          emoji: task.emoji,
          points: task.points,
          completedAt: new Date().toISOString(),
        },
        ...prev.completions,
      ],
    }))
  }, [])

  const addCustomTask = useCallback((name: string, points: number, emoji: string) => {
    setState((prev) => ({
      ...prev,
      tasks: [...prev.tasks, { id: randomId(), name, points, emoji, tone: 'blue', isCustom: true }],
    }))
  }, [])

  const addIdeaTask = useCallback((idea: Task) => {
    setState((prev) => (prev.tasks.some((t) => t.id === idea.id) ? prev : { ...prev, tasks: [...prev.tasks, idea] }))
  }, [])

  const removeTask = useCallback((taskId: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
      hiddenTaskIds: prev.hiddenTaskIds.filter((id) => id !== taskId),
    }))
  }, [])

  const hideTask = useCallback((taskId: string) => {
    setState((prev) => (prev.hiddenTaskIds.includes(taskId) ? prev : { ...prev, hiddenTaskIds: [...prev.hiddenTaskIds, taskId] }))
  }, [])

  const unhideTask = useCallback((taskId: string) => {
    setState((prev) => ({ ...prev, hiddenTaskIds: prev.hiddenTaskIds.filter((id) => id !== taskId) }))
  }, [])

  const addCustomSite = useCallback((name: string, ratePer5Min: number) => {
    setState((prev) => ({
      ...prev,
      sites: [...prev.sites, { id: randomId(), name, ratePer5Min, tone: 'blue', isCustom: true }],
    }))
  }, [])

  const removeSite = useCallback((siteId: string) => {
    setState((prev) => ({ ...prev, sites: prev.sites.filter((s) => s.id !== siteId) }))
  }, [])

  const unlockSite = useCallback(
    (site: Site, minutes: number) => {
      const cost = costFor(site, minutes)
      if (cost > balance) return
      setState((prev) => ({
        ...prev,
        unlocks: [
          { id: randomId(), siteId: site.id, siteName: site.name, minutes, cost, unlockedAt: new Date().toISOString() },
          ...prev.unlocks,
        ],
      }))
    },
    [balance],
  )

  const snoozeAlarm = useCallback(
    (unlockId: string, extraMinutes: number) => {
      setState((prev) => {
        const unlock = prev.unlocks.find((u) => u.id === unlockId)
        if (!unlock) return prev
        const cost = unlock.nextSnoozeCost ?? ALARM_SNOOZE_BASE_COST
        if (cost > balance) return prev
        return {
          ...prev,
          unlocks: prev.unlocks.map((u) =>
            u.id === unlockId
              ? {
                  ...u,
                  minutes: u.minutes + extraMinutes,
                  snoozeSpent: (u.snoozeSpent ?? 0) + cost,
                  snoozeCount: (u.snoozeCount ?? 0) + 1,
                  nextSnoozeCost: cost * 2,
                }
              : u,
          ),
        }
      })
    },
    [balance],
  )

  const dismissAlarm = useCallback((unlockId: string) => {
    setState((prev) => ({
      ...prev,
      unlocks: prev.unlocks.map((u) =>
        u.id === unlockId ? { ...u, dismissedAt: new Date().toISOString(), bonusCoins: (u.bonusCoins ?? 0) + ALARM_DONE_BONUS } : u,
      ),
    }))
  }, [])

  const setAlarmStyle = useCallback((alarmStyle: AlarmStyle) => {
    setState((prev) => ({ ...prev, alarmStyle }))
  }, [])

  const setNotifyEnabled = useCallback((notifyEnabled: boolean) => {
    setState((prev) => ({ ...prev, notifyEnabled }))
  }, [])

  const pickBuddy = useCallback((buddyId: string) => {
    setState((prev) => ({ ...prev, buddyId }))
  }, [])

  const setDisplayName = useCallback((displayName: string) => {
    setState((prev) => ({ ...prev, displayName }))
  }, [])

  const setTheme = useCallback((theme: Theme) => {
    setState((prev) => ({ ...prev, theme }))
  }, [])

  const setLanguage = useCallback((language: string) => {
    setState((prev) => ({ ...prev, language }))
  }, [])

  const doExport = useCallback(() => exportState(state), [state])

  const doImport = useCallback(async (file: File) => {
    const text = await file.text()
    const imported = parseImportedState(text)
    setState(imported)
  }, [])

  return {
    state,
    balance,
    streak,
    week,
    openUnlocks,
    activeAlarm,
    snoozeAlarm,
    dismissAlarm,
    setAlarmStyle,
    setNotifyEnabled,
    completeTask,
    addCustomTask,
    addIdeaTask,
    removeTask,
    hideTask,
    unhideTask,
    addCustomSite,
    removeSite,
    unlockSite,
    pickBuddy,
    setDisplayName,
    setTheme,
    setLanguage,
    exportState: doExport,
    importState: doImport,
  }
}
