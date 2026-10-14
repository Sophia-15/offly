import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { findBuddy } from '../../entities/buddy/model'
import { IdeaCard } from '../../entities/task/IdeaCard'
import { IDEA_TASKS } from '../../entities/task/model'
import { TaskCard } from '../../entities/task/TaskCard'
import type { Task } from '../../entities/task/model'
import { SiteCard } from '../../entities/site/SiteCard'
import { costFor, type Site } from '../../entities/site/model'
import { AddTaskForm } from '../../features/add-custom-task/AddTaskForm'
import { Icon } from '../../shared/ui/Icon'
import { formatMinutesSeconds } from '../../shared/lib/time'
import { HeroBanner } from '../../widgets/hero-banner/HeroBanner'
import { WeekStreak } from '../../widgets/week-streak/WeekStreak'
import type { WeekDay } from '../../shared/lib/streak'

const QUICK_UNLOCK_MINUTES = 15

interface OpenUnlock {
  id: string
  siteId: string
  siteName: string
  remainingSeconds: number
}

interface MissionsPageProps {
  tasks: Task[]
  hiddenTaskIds: string[]
  completionsToday: number
  currentStreak: number
  week: WeekDay[]
  buddyId: string
  displayName: string
  balance: number
  sites: Site[]
  openUnlocks: OpenUnlock[]
  onComplete: (task: Task) => void
  onHideTask: (taskId: string) => void
  onUnhideTask: (taskId: string) => void
  onRemoveTask: (taskId: string) => void
  onAddTask: (name: string, points: number, emoji: string) => void
  onAddIdea: (idea: Task) => void
  onUnlock: (site: Site, minutes: number) => void
}

export function MissionsPage({
  tasks,
  hiddenTaskIds,
  completionsToday,
  currentStreak,
  week,
  buddyId,
  displayName,
  balance,
  sites,
  openUnlocks,
  onComplete,
  onHideTask,
  onUnhideTask,
  onRemoveTask,
  onAddTask,
  onAddIdea,
  onUnlock,
}: MissionsPageProps) {
  const { t } = useTranslation()
  const buddy = findBuddy(buddyId)
  const bubbleLine = currentStreak > 0 ? t('missions.bubble_streak', { count: currentStreak }) : t(buddy.lineKey)
  const addTaskNameRef = useRef<HTMLInputElement>(null)

  const visibleTasks = tasks.filter((task) => !hiddenTaskIds.includes(task.id))
  const hiddenTasks = tasks.filter((task) => hiddenTaskIds.includes(task.id))
  const ideas = IDEA_TASKS.filter((idea) => !tasks.some((t) => t.id === idea.id))

  const openSiteIds = new Set(openUnlocks.map((u) => u.siteId))
  const quickSites = sites
    .filter((s) => !openSiteIds.has(s.id))
    .slice()
    .sort((a, b) => a.ratePer5Min - b.ratePer5Min)
    .slice(0, 2)

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 56px', boxSizing: 'border-box' }}>
      <HeroBanner
        buddy={buddy}
        bubbleLine={bubbleLine}
        doneCount={completionsToday}
        totalCount={visibleTasks.length}
        name={displayName}
        balance={balance}
        streakCurrent={currentStreak}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginTop: 24, alignItems: 'flex-start' }}>
        <section style={{ flex: '999 1 480px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>{t('missions.todays_missions')}</h2>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-muted)' }}>
              {t('missions.done_count', { done: completionsToday, total: visibleTasks.length })}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {visibleTasks.map((task) => (
              <TaskCard key={task.id} task={task} onComplete={onComplete} onHide={onHideTask} onRemove={onRemoveTask} />
            ))}
          </div>
          <AddTaskForm onAdd={onAddTask} nameInputRef={addTaskNameRef} />
          {hiddenTasks.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-muted)' }}>{t('missions.hidden_missions_label')}</span>
              {hiddenTasks.map((task) => {
                const name = task.nameKey ? t(task.nameKey) : task.name
                return (
                  <button
                    key={task.id}
                    type="button"
                    className="nav-link"
                    onClick={() => onUnhideTask(task.id)}
                    aria-label={t('missions.unhide_aria', { name })}
                    style={{ fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                  >
                    <Icon name="show" size={14} />
                    {name}
                  </button>
                )
              })}
            </div>
          )}

          {ideas.length > 0 && (
            <>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 16 }}>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>{t('missions.ideas_for_later')}</h2>
                <button
                  type="button"
                  onClick={() => addTaskNameRef.current?.focus()}
                  style={{ background: 'none', border: 0, cursor: 'pointer', fontSize: 13, fontWeight: 800, color: 'var(--blue)', padding: 0 }}
                >
                  {t('missions.make_your_own')}
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
                {ideas.map((idea) => (
                  <IdeaCard key={idea.id} idea={idea} onAdd={onAddIdea} />
                ))}
              </div>
            </>
          )}
        </section>
        <aside style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {openUnlocks.length > 0 && (
            <>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{t('unlocks.open_now')}</h2>
              {openUnlocks.map((u) => {
                const site = sites.find((s) => s.id === u.siteId)
                if (!site) return null
                return <SiteCard key={u.id} site={site} state="open" remainingLabel={formatMinutesSeconds(u.remainingSeconds)} />
              })}
            </>
          )}
          {quickSites.length > 0 && (
            <>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{t('missions.quick_unlock')}</h2>
              {quickSites.map((site) => {
                const cost = costFor(site, QUICK_UNLOCK_MINUTES)
                return (
                  <SiteCard
                    key={site.id}
                    site={site}
                    state="locked"
                    minutes={QUICK_UNLOCK_MINUTES}
                    cost={cost}
                    disabled={cost > balance}
                    onUnlock={() => onUnlock(site, QUICK_UNLOCK_MINUTES)}
                  />
                )
              })}
            </>
          )}
          <WeekStreak week={week} />
        </aside>
      </div>
    </main>
  )
}
