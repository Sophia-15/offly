import type { CompletionEntry, Task } from '../../entities/task/model'
import type { Site, UnlockEntry } from '../../entities/site/model'

export type Theme = 'system' | 'light' | 'dark'

/** How aggressively the times-up alarm escalates: gentle never dims the screen,
 *  persistent dims but never takes over, relentless runs the full 3-stage takeover + coin drain. */
export type AlarmStyle = 'gentle' | 'persistent' | 'relentless'

export interface AppState {
  tasks: Task[]
  completions: CompletionEntry[]
  sites: Site[]
  unlocks: UnlockEntry[]
  buddyId: string
  displayName: string
  theme: Theme
  language: string
  hiddenTaskIds: string[]
  alarmStyle: AlarmStyle
  notifyEnabled: boolean
}
