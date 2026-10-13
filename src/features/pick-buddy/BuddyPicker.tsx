import { useTranslation } from 'react-i18next'
import { BUDDIES } from '../../entities/buddy/model'
import { BuddyAvatar } from '../../entities/buddy/BuddyAvatar'

interface BuddyPickerProps {
  selectedId: string
  onPick: (buddyId: string) => void
}

export function BuddyPicker({ selectedId, onPick }: BuddyPickerProps) {
  const { t } = useTranslation()

  return (
    <div
      role="radiogroup"
      aria-label={t('me.your_buddy')}
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12 }}
    >
      {BUDDIES.map((buddy) => {
        const checked = buddy.id === selectedId
        return (
          <button
            key={buddy.id}
            type="button"
            role="radio"
            aria-checked={checked}
            onClick={() => onPick(buddy.id)}
            className={`pick ${checked ? 'pick-active' : ''}`}
          >
            <BuddyAvatar buddy={buddy} size={56} />
            <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink)' }}>{buddy.name}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-muted)' }}>{t(buddy.roleKey)}</span>
          </button>
        )
      })}
    </div>
  )
}
