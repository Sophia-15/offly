import { useTranslation } from 'react-i18next'
import { UNLOCK_LENGTHS_MINUTES } from '../../entities/site/model'

interface DurationPickerProps {
  minutes: number
  onPick: (minutes: number) => void
}

export function DurationPicker({ minutes, onPick }: DurationPickerProps) {
  const { t } = useTranslation()

  return (
    <div
      role="group"
      aria-label={t('unlocks.how_long')}
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12 }}
    >
      {UNLOCK_LENGTHS_MINUTES.map((m) => {
        const active = m === minutes
        return (
          <button
            key={m}
            type="button"
            className={`pick ${active ? 'pick-active' : ''}`}
            aria-pressed={active}
            onClick={() => onPick(m)}
            style={{ alignItems: 'flex-start', textAlign: 'left' }}
          >
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, color: 'var(--ink)' }}>
              {t('unlocks.min_suffix', { count: m })}
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-muted)' }}>{t(`unlocks.length_hint_${m}`)}</span>
          </button>
        )
      })}
    </div>
  )
}
