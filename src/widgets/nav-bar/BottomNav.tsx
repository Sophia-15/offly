import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import { Icon } from '../../shared/ui/Icon'
import type { PageId } from './NavBar'

const TABS: { id: PageId; icon: 'check' | 'focus' | 'unlock' | 'person' }[] = [
  { id: 'missions', icon: 'check' },
  { id: 'focus', icon: 'focus' },
  { id: 'unlocks', icon: 'unlock' },
  { id: 'me', icon: 'person' },
]

export function BottomNav() {
  const { t } = useTranslation()

  return (
    <nav className="bottom-nav" aria-label="Main">
      {TABS.map((tab) => (
        <Link
          key={tab.id}
          to={`/${tab.id}`}
          className="bottom-nav-item"
          activeProps={{ className: 'bottom-nav-item bottom-nav-item-active' }}
        >
          <Icon name={tab.icon} size={20} />
          {t(`nav.${tab.id}`)}
        </Link>
      ))}
    </nav>
  )
}
