import { useTranslation } from 'react-i18next'
import { SwipeRow } from '../../shared/ui/SwipeRow'
import { Tile } from '../../shared/ui/Tile'
import type { Task } from './model'

interface TaskCardProps {
  task: Task
  onComplete: (task: Task) => void
  onHide: (taskId: string) => void
  onRemove: (taskId: string) => void
}

export function TaskCard({ task, onComplete, onHide, onRemove }: TaskCardProps) {
  const { t } = useTranslation()
  const displayName = task.nameKey ? t(task.nameKey) : task.name

  return (
    <SwipeRow
      onHide={() => onHide(task.id)}
      onDelete={() => onRemove(task.id)}
      hideLabel={t('missions.hide')}
      deleteLabel={t('missions.delete')}
      ariaLabel={t('missions.swipe_hint', { name: displayName })}
    >
      <div className="card">
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
    </SwipeRow>
  )
}
