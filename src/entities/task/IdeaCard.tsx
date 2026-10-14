import { useTranslation } from 'react-i18next'
import { Tile } from '../../shared/ui/Tile'
import type { Task } from './model'

interface IdeaCardProps {
  idea: Task
  onAdd: (idea: Task) => void
}

export function IdeaCard({ idea, onAdd }: IdeaCardProps) {
  const { t } = useTranslation()
  const displayName = idea.nameKey ? t(idea.nameKey) : idea.name

  return (
    <div className="card">
      <div className="card-row">
        <Tile tone={idea.tone}>
          <span aria-hidden>{idea.emoji}</span>
        </Tile>
        <div className="card-text">
          <p className="card-title">{displayName}</p>
          <p className="card-meta">{t('missions.coins_suffix', { points: idea.points })}</p>
        </div>
      </div>
      <button type="button" className="btn btn-ghost btn-sm btn-block" onClick={() => onAdd(idea)}>
        {t('missions.add_idea')}
      </button>
    </div>
  )
}
