import type { CompletionEntry, Task } from '../../entities/task/model'
import type { Site, UnlockEntry } from '../../entities/site/model'

export type Theme = 'system' | 'light' | 'dark'

export interface AppState {
  tasks: Task[]
  completions: CompletionEntry[]
  sites: Site[]
  unlocks: UnlockEntry[]
  buddyId: string
  displayName: string
  theme: Theme
  language: string
}
