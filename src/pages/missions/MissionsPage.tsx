import { useTranslation } from 'react-i18next'
import { findBuddy } from '../../entities/buddy/model'
import { TaskCard } from '../../entities/task/TaskCard'
import type { Task } from '../../entities/task/model'
import { AddTaskForm } from '../../features/add-custom-task/AddTaskForm'
import { HeroBanner } from '../../widgets/hero-banner/HeroBanner'
import { WeekStreak } from '../../widgets/week-streak/WeekStreak'
import type { WeekDay } from '../../shared/lib/streak'

interface MissionsPageProps {
  tasks: Task[]
  completionsToday: number
  currentStreak: number
  week: WeekDay[]
  buddyId: string
  displayName: string
  onComplete: (task: Task) => void
  onRemoveTask: (taskId: string) => void
  onAddTask: (name: string, points: number, emoji: string) => void
}

export function MissionsPage({ tasks, completionsToday, currentStreak, week, buddyId, displayName, onComplete, onRemoveTask, onAddTask }: MissionsPageProps) {
  const { t } = useTranslation()
  const buddy = findBuddy(buddyId)
  const bubbleLine = currentStreak > 0 ? t('missions.bubble_streak', { count: currentStreak }) : t(buddy.lineKey)

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 56px', boxSizing: 'border-box' }}>
      <HeroBanner buddy={buddy} bubbleLine={bubbleLine} doneCount={completionsToday} totalCount={tasks.length} name={displayName} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginTop: 24, alignItems: 'flex-start' }}>
        <section style={{ flex: '999 1 480px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>{t('missions.todays_missions')}</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onComplete={onComplete} onRemove={onRemoveTask} />
            ))}
          </div>
          <AddTaskForm onAdd={onAddTask} />
        </section>
        <aside style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <WeekStreak week={week} />
        </aside>
      </div>
    </main>
  )
}
