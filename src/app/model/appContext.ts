import { createContext, useState } from 'react'
import type { Task } from '../../entities/task/model'
import { useAppState } from './useAppState'

interface CompletedTaskInfo {
  task: Task
  newBalance: number
}

interface StoppedAlarmInfo {
  snoozeCount: number
  bonus: number
}

export function useAppWithUI() {
  const appState = useAppState()
  const [completedTask, setCompletedTask] = useState<CompletedTaskInfo | null>(null)
  const [stoppedAlarm, setStoppedAlarm] = useState<StoppedAlarmInfo | null>(null)
  return { ...appState, completedTask, setCompletedTask, stoppedAlarm, setStoppedAlarm }
}

export type AppContextValue = ReturnType<typeof useAppWithUI>

export const AppStateContext = createContext<AppContextValue | null>(null)
