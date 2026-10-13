import { useTranslation } from 'react-i18next'
import { Tile } from '../../shared/ui/Tile'
import type { Task } from './model'

interface TaskCardProps {
  task: Task
  onComplete: (task: Task) => void
  onRemove?: (taskId: string) => void
}

export function TaskCard({ task, onComplete, onRemove }: TaskCardProps) {
  const { t } = useTranslation()
  const displayName = task.nameKey ? t(task.nameKey) : task.name

  return (
    <div className="card" style={{ position: 'relative' }}>
      {task.isCustom && onRemove && (
        <button
          type="button"
          onClick={() => onRemove(task.id)}
          aria-label={t('missions.remove_task_aria', { name: displayName })}
          className="nav-link"
          style={{ position: 'absolute', right: 8, top: 8, width: 28, height: 28, padding: 0 }}
        >
          ×
        </button>
      )}
      <div className="card-row">
        <Tile tone={task.tone}>
          <span aria-hidden>{task.emoji}</span>
        </Tile>
        <div className="card-text">
          <p className="card-title">{displayName}</p>
          <p className="card-meta">{t('missions.coins_suffix', { points: task.points })}</p>
        </div>
      </div>
      <button type="button" className="btn btn-mint btn-sm btn-block" onClick={() => onComplete(task)}>
        {t('missions.done_button')}
      </button>
    </div>
  )
}
