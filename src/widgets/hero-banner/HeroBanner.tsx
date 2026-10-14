import { useTranslation } from 'react-i18next'
import type { Buddy } from '../../entities/buddy/model'
import { BuddyAvatar } from '../../entities/buddy/BuddyAvatar'
import { Bubble } from '../../shared/ui/Bubble'
import { CoinBadge } from '../../shared/ui/CoinBadge'
import { Icon } from '../../shared/ui/Icon'
import { Logo } from '../../shared/ui/Logo'
import { Scene } from '../../shared/ui/Scene'

interface HeroBannerProps {
  buddy: Buddy
  bubbleLine: string
  doneCount: number
  totalCount: number
  name?: string
  balance: number
  streakCurrent: number
}

export function HeroBanner({ buddy, bubbleLine, doneCount, totalCount, name, balance, streakCurrent }: HeroBannerProps) {
  const { t } = useTranslation()
  const remaining = Math.max(0, totalCount - doneCount)

  const hour = new Date().getHours()
  const greetingKey = hour < 12 ? 'missions.greeting_morning' : hour < 18 ? 'missions.greeting_afternoon' : 'missions.greeting_evening'
  const greeting = name ? `${t(greetingKey)}, ${name}` : t(greetingKey)

  const subtext =
    totalCount === 0
      ? t('missions.subtext_empty')
      : remaining === 0
        ? t('missions.subtext_all_done')
        : t('missions.subtext_progress', { done: doneCount, total: totalCount, remaining })

  const streakBadge = (
    <span
      aria-label={t('nav.streak_aria', { count: streakCurrent })}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        height: 36,
        padding: '0 12px',
        boxSizing: 'border-box',
        borderRadius: 999,
        background: 'var(--surface-raised)',
        border: '1.5px solid var(--line)',
        boxShadow: 'var(--shadow-edge)',
        color: 'var(--tangerine)',
        fontWeight: 900,
        fontSize: 15,
      }}
    >
      <Icon name="flame" size={16} />
      <span style={{ color: 'var(--ink)' }}>{streakCurrent}</span>
    </span>
  )

  return (
    <>
      {/* Wide layout: one landscape-format scene with the greeting on the left and the buddy bottom-right */}
      <div className="hide-mobile" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative' }}>
        <Scene height={240} wide>
          <div style={{ position: 'absolute', left: 32, top: 32, maxWidth: 380 }}>
            <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 34, lineHeight: 1.1, color: 'var(--scene-ink, var(--ink))' }}>
              {greeting}
            </h1>
            <p style={{ margin: '8px 0 0', fontSize: 15, lineHeight: '22px', fontWeight: 700, color: 'var(--scene-ink, var(--ink))' }}>{subtext}</p>
          </div>
          <div style={{ position: 'absolute', left: '58%', bottom: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <Bubble>{bubbleLine}</Bubble>
            <BuddyAvatar buddy={buddy} size={88} />
          </div>
        </Scene>
      </div>

      {/* Phone layout: its own narrow scene — logo + badges up top, bubble and buddy centered below */}
      <div className="show-mobile-flex" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative' }}>
        <Scene height={380}>
          <div style={{ display: 'flex', position: 'absolute', left: 20, right: 20, top: 20, alignItems: 'center', justifyContent: 'space-between' }}>
            <Logo height={28} />
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {streakBadge}
              <CoinBadge amount={balance} />
            </div>
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 118, display: 'flex', justifyContent: 'center', padding: '0 20px' }}>
            <Bubble>{bubbleLine}</Bubble>
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 198, display: 'flex', justifyContent: 'center' }}>
            <BuddyAvatar buddy={buddy} size={118} />
          </div>
        </Scene>
      </div>
    </>
  )
}
