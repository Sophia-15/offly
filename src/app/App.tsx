import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MePage } from '../pages/me/MePage'
import { MissionsPage } from '../pages/missions/MissionsPage'
import { FocusPage } from '../pages/focus/FocusPage'
import { UnlocksPage } from '../pages/unlocks/UnlocksPage'
import { MissionCompletePage } from '../widgets/mission-complete/MissionCompletePage'
import { BottomNav } from '../widgets/nav-bar/BottomNav'
import { NavBar, type PageId } from '../widgets/nav-bar/NavBar'
import { useAppState } from './model/useAppState'
import type { Task } from '../entities/task/model'
import { FOCUS_ROUND_COINS } from '../features/pomodoro/usePomodoroTimer'

function todayKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

const FOCUS_ROUND_TASK: Task = {
  id: 'focus-round',
  name: 'Focus round',
  nameKey: 'focus.round_task_name',
  emoji: '🍅',
  points: FOCUS_ROUND_COINS,
  tone: 'blue',
  isCustom: false,
}

function App() {
  const {
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
    exportState,
    importState,
  } = useAppState()

  const { t, i18n } = useTranslation()
  const [page, setPage] = useState<PageId>('missions')
  const [completedTask, setCompletedTask] = useState<{ task: Task; newBalance: number } | null>(null)

  useEffect(() => {
    if (state.theme === 'system') {
      document.documentElement.removeAttribute('data-theme')
    } else {
      document.documentElement.setAttribute('data-theme', state.theme)
    }
  }, [state.theme])

  useEffect(() => {
    if (i18n.language !== state.language) {
      void i18n.changeLanguage(state.language)
    }
    document.documentElement.lang = state.language
  }, [state.language, i18n])

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

  const totalSpent = useMemo(() => state.unlocks.reduce((sum, u) => sum + u.cost, 0), [state.unlocks])

  const cheapestSiteRate = useMemo(() => {
    if (state.sites.length === 0) return 0
    return Math.min(...state.sites.map((s) => s.ratePer5Min))
  }, [state.sites])

  function buysMinutesFor(coinBalance: number): number {
    if (cheapestSiteRate <= 0) return 0
    return Math.round((coinBalance * 5) / cheapestSiteRate)
  }

  function handleComplete(task: Task) {
    completeTask(task)
    setCompletedTask({ task, newBalance: balance + task.points })
  }

  function handleFocusRoundComplete() {
    completeTask(FOCUS_ROUND_TASK)
  }

  const completedTaskName = completedTask ? (completedTask.task.nameKey ? t(completedTask.task.nameKey) : completedTask.task.name) : ''

  return (
    <div style={{ minHeight: '100vh' }}>
      {completedTask && (
        <MissionCompletePage
          taskName={completedTaskName}
          points={completedTask.task.points}
          newBalance={completedTask.newBalance}
          streakCurrent={Math.max(streak.current, 1)}
          buysMinutes={buysMinutesFor(completedTask.newBalance)}
          onDismiss={() => setCompletedTask(null)}
        />
      )}
      <NavBar active={page} onNavigate={setPage} balance={balance} streak={streak.current} />
      <div className="page-content">
        {page === 'missions' && (
          <MissionsPage
            tasks={state.tasks}
            completionsToday={completionsToday}
            currentStreak={streak.current}
            week={week}
            buddyId={state.buddyId}
            displayName={state.displayName}
            onComplete={handleComplete}
            onRemoveTask={removeTask}
            onAddTask={addCustomTask}
          />
        )}
        {page === 'focus' && <FocusPage completions={state.completions} onFocusRoundComplete={handleFocusRoundComplete} />}
        {page === 'unlocks' && (
          <UnlocksPage
            sites={state.sites}
            openUnlocks={openUnlocks}
            balance={balance}
            onUnlock={unlockSite}
            onAddSite={addCustomSite}
            onRemoveSite={removeSite}
          />
        )}
        {page === 'me' && (
          <MePage
            buddyId={state.buddyId}
            onPickBuddy={pickBuddy}
            displayName={state.displayName}
            onChangeDisplayName={setDisplayName}
            theme={state.theme}
            onChangeTheme={setTheme}
            language={state.language}
            onChangeLanguage={setLanguage}
            totalPoints={streak.totalPoints}
            longestStreak={streak.longest}
            totalCompletions={streak.totalCompletions}
            totalSpent={totalSpent}
            onExport={exportState}
            onImport={importState}
          />
        )}
      </div>
      <BottomNav active={page} onNavigate={setPage} />
    </div>
  )
}

export default App
