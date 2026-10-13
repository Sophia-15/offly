import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Task } from '../../entities/task/model'
import { costFor, type Site } from '../../entities/site/model'
import { randomId } from '../../shared/lib/id'
import { computeStreakStats, computeWeek } from '../../shared/lib/streak'
import { exportState, loadState, parseImportedState, saveState } from '../../shared/lib/storage'
import type { AppState, Theme } from './types'

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
    const spent = state.unlocks.reduce((sum, u) => sum + u.cost, 0)
    return earned - spent
  }, [state.completions, state.unlocks])

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

  const removeTask = useCallback((taskId: string) => {
    setState((prev) => ({ ...prev, tasks: prev.tasks.filter((t) => t.id !== taskId) }))
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
    completeTask,
    addCustomTask,
    removeTask,
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
