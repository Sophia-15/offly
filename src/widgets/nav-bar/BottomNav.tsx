import { useTranslation } from 'react-i18next'
import { Icon } from '../../shared/ui/Icon'
import type { PageId } from './NavBar'

const TABS: { id: PageId; icon: 'check' | 'focus' | 'unlock' | 'person' }[] = [
  { id: 'missions', icon: 'check' },
  { id: 'focus', icon: 'focus' },
  { id: 'unlocks', icon: 'unlock' },
  { id: 'me', icon: 'person' },
]

interface BottomNavProps {
  active: PageId
  onNavigate: (page: PageId) => void
}

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  const { t } = useTranslation()

  return (
    <nav className="bottom-nav" aria-label="Main">
      {TABS.map((tab) => {
        const isActive = tab.id === active
        return (
          <button
            key={tab.id}
            type="button"
            className={`bottom-nav-item ${isActive ? 'bottom-nav-item-active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onNavigate(tab.id)}
          >
            <Icon name={tab.icon} size={20} />
            {t(`nav.${tab.id}`)}
          </button>
        )
      })}
    </nav>
  )
}
