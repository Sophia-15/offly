import { useMemo } from 'react'
import { MissionsPage } from '../../pages/missions/MissionsPage'
import type { Task } from '../../entities/task/model'
import { useApp } from '../model/useApp'

function todayKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

export function MissionsRoute() {
  const {
    state,
    balance,
    streak,
    week,
    openUnlocks,
    completeTask,
    hideTask,
    unhideTask,
    removeTask,
    addCustomTask,
    addIdeaTask,
    unlockSite,
    setCompletedTask,
  } = useApp()

  const completionsToday = useMemo(() => {
    const key = todayKey()
    const ids = new Set(
      state.completions
        .filter((c) => {
          const d = new Date(c.completedAt)
          return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}` === key
        })
        .map((c) => c.taskId),
    )
    return ids.size
  }, [state.completions])

  function handleComplete(task: Task) {
    completeTask(task)
    setCompletedTask({ task, newBalance: balance + task.points })
  }

  return (
    <MissionsPage
      tasks={state.tasks}
      hiddenTaskIds={state.hiddenTaskIds}
      completionsToday={completionsToday}
      currentStreak={streak.current}
      week={week}
      buddyId={state.buddyId}
      displayName={state.displayName}
      balance={balance}
      sites={state.sites}
      openUnlocks={openUnlocks}
      onComplete={handleComplete}
      onHideTask={hideTask}
      onUnhideTask={unhideTask}
      onRemoveTask={removeTask}
      onAddTask={addCustomTask}
      onAddIdea={addIdeaTask}
      onUnlock={unlockSite}
    />
  )
}
