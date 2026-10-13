import { useTranslation } from 'react-i18next'
import { Button } from '../../shared/ui/Button'
import { Coin } from '../../shared/ui/Coin'
import { Icon } from '../../shared/ui/Icon'
import { Tile } from '../../shared/ui/Tile'
import type { Site } from './model'

interface SiteCardOpenProps {
  site: Site
  state: 'open'
  remainingLabel: string
}

interface SiteCardLockedProps {
  site: Site
  state: 'locked'
  minutes: number
  cost: number
  disabled: boolean
  onUnlock: () => void
}

type SiteCardProps = SiteCardOpenProps | SiteCardLockedProps

export function SiteCard(props: SiteCardProps) {
  const { t } = useTranslation()
  const { site } = props
  const isOpen = props.state === 'open'

  return (
    <div className={`card ${isOpen ? 'card-open' : ''}`}>
      <div className="card-row">
        <Tile tone={site.tone}>
          <span className="tile-letter">{site.name.charAt(0)}</span>
        </Tile>
        <div className="card-text">
          <p className="card-title">{site.name}</p>
          <p className="card-meta">
            {isOpen ? (
              <>
                <Icon name="clock" size={14} strokeWidth={2.6} />
                {t('unlocks.minutes_left', { label: props.remainingLabel })}
              </>
            ) : (
              t('unlocks.min_suffix', { count: props.minutes })
            )}
          </p>
        </div>
        {isOpen ? (
          <span className="check" aria-label={t('unlocks.unlocked_aria')}>
            <Icon name="unlock" size={16} strokeWidth={2.8} />
          </span>
        ) : (
          <Button
            variant="sun"
            size="sm"
            disabled={props.disabled}
            onClick={props.onUnlock}
            aria-label={t('unlocks.unlock_aria', { site: site.name, cost: props.cost })}
          >
            <Coin size={18} />
            {props.cost}
          </Button>
        )}
      </div>
    </div>
  )
}
