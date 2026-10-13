import { useTranslation } from 'react-i18next'
import { CoinBadge } from '../../shared/ui/CoinBadge'
import { Icon } from '../../shared/ui/Icon'
import { Logo } from '../../shared/ui/Logo'

export type PageId = 'missions' | 'focus' | 'unlocks' | 'me'

const TAB_IDS: PageId[] = ['missions', 'focus', 'unlocks', 'me']

interface NavBarProps {
  active: PageId
  onNavigate: (page: PageId) => void
  balance: number
  streak: number
}

export function NavBar({ active, onNavigate, balance, streak }: NavBarProps) {
  const { t } = useTranslation()

  return (
    <header
      style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '20px 24px',
        boxSizing: 'border-box',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '16px 24px',
      }}
    >
      <Logo height={32} />
      <nav className="top-nav-links" aria-label="Main">
        {TAB_IDS.map((id) => (
          <button
            key={id}
            type="button"
            className={`nav-link ${active === id ? 'nav-link-active' : ''}`}
            aria-current={active === id ? 'page' : undefined}
            onClick={() => onNavigate(id)}
          >
            {t(`nav.${id}`)}
          </button>
        ))}
      </nav>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          aria-label={t('nav.streak_aria', { count: streak })}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            height: 40,
            padding: '0 14px',
            boxSizing: 'border-box',
            borderRadius: 999,
            background: 'var(--surface-raised)',
            border: '1.5px solid var(--line)',
            boxShadow: 'var(--shadow-edge)',
            color: 'var(--tangerine)',
            fontWeight: 900,
            fontSize: 16,
          }}
        >
          <Icon name="flame" size={18} />
          <span style={{ color: 'var(--ink)' }}>{streak}</span>
        </span>
        <CoinBadge amount={balance} />
      </div>
    </header>
  )
}
