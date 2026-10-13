import { useTranslation } from 'react-i18next'
import type { Buddy } from '../../entities/buddy/model'
import { BuddyAvatar } from '../../entities/buddy/BuddyAvatar'
import { Bubble } from '../../shared/ui/Bubble'
import { Scene } from '../../shared/ui/Scene'

interface HeroBannerProps {
  buddy: Buddy
  bubbleLine: string
  doneCount: number
  totalCount: number
  name?: string
}

export function HeroBanner({ buddy, bubbleLine, doneCount, totalCount, name }: HeroBannerProps) {
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

  return (
    <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative' }}>
      <Scene height={240} time="day" wide />
      <div style={{ position: 'absolute', left: 32, top: 32, maxWidth: 380 }}>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 34, lineHeight: 1.1, color: 'var(--ink)' }}>
          {greeting}
        </h1>
        <p style={{ margin: '8px 0 0', fontSize: 15, lineHeight: '22px', fontWeight: 700, color: 'var(--ink)' }}>{subtext}</p>
      </div>
      <div style={{ position: 'absolute', left: '58%', bottom: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <Bubble>{bubbleLine}</Bubble>
        <BuddyAvatar buddy={buddy} size={88} />
      </div>
    </div>
  )
}
