import { FocusPage } from '../../pages/focus/FocusPage'
import { FOCUS_ROUND_COINS } from '../../features/pomodoro/usePomodoroTimer'
import type { Task } from '../../entities/task/model'
import { useApp } from '../model/useApp'

const FOCUS_ROUND_TASK: Task = {
  id: 'focus-round',
  name: 'Focus round',
  nameKey: 'focus.round_task_name',
  emoji: '🍅',
  points: FOCUS_ROUND_COINS,
  tone: 'blue',
  isCustom: false,
}

export function FocusRoute() {
  const { state, balance, completeTask } = useApp()

  function handleFocusRoundComplete() {
    completeTask(FOCUS_ROUND_TASK)
  }

  return <FocusPage completions={state.completions} balance={balance} onFocusRoundComplete={handleFocusRoundComplete} />
}
