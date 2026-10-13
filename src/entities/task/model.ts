import type { Tone } from '../../shared/ui/Tile'

export interface Task {
  id: string
  /** Literal name — what custom tasks store and display as-is. */
  name: string
  /** Translation key for built-in tasks; when set, this is shown instead of `name`. */
  nameKey?: string
  emoji: string
  points: number
  tone: Tone
  isCustom: boolean
}

export interface CompletionEntry {
  id: string
  taskId: string
  taskName: string
  emoji: string
  points: number
  completedAt: string
}

export const DEFAULT_TASKS: Task[] = [
  { id: 'walk', name: 'Walk for 10 minutes', nameKey: 'missions.default.walk', emoji: '🚶', points: 10, tone: 'tangerine', isCustom: false },
  { id: 'read', name: 'Read for 15 minutes', nameKey: 'missions.default.read', emoji: '📖', points: 15, tone: 'sun', isCustom: false },
  { id: 'meditate', name: 'Meditate for 5 minutes', nameKey: 'missions.default.meditate', emoji: '🧘', points: 10, tone: 'mint', isCustom: false },
  { id: 'water', name: 'Drink a glass of water', nameKey: 'missions.default.water', emoji: '💧', points: 2, tone: 'blue', isCustom: false },
  { id: 'stretch', name: 'Stretch for 5 minutes', nameKey: 'missions.default.stretch', emoji: '🤸', points: 5, tone: 'mint', isCustom: false },
  { id: 'focus-work', name: 'Focused work for 25 minutes', nameKey: 'missions.default.focus_work', emoji: '📝', points: 20, tone: 'blue', isCustom: false },
  { id: 'tidy', name: 'Tidy your space for 5 minutes', nameKey: 'missions.default.tidy', emoji: '🧹', points: 5, tone: 'ink', isCustom: false },
  { id: 'journal', name: 'Journal for a few minutes', nameKey: 'missions.default.journal', emoji: '🖊️', points: 10, tone: 'sun', isCustom: false },
  { id: 'cook', name: 'Cook a meal', nameKey: 'missions.default.cook', emoji: '🍳', points: 15, tone: 'tangerine', isCustom: false },
  { id: 'call', name: 'Call a friend or family member', nameKey: 'missions.default.call', emoji: '📞', points: 10, tone: 'blue', isCustom: false },
  { id: 'outside', name: 'Go outside', nameKey: 'missions.default.outside', emoji: '🌳', points: 5, tone: 'mint', isCustom: false },
  { id: 'workout', name: 'Workout for 30 minutes', nameKey: 'missions.default.workout', emoji: '🏋️', points: 25, tone: 'tangerine', isCustom: false },
]
