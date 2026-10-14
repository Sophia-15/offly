import { useTranslation } from 'react-i18next'
import { Button } from '../../shared/ui/Button'
import { Celebration } from '../../shared/ui/Celebration'
import { CoinBadge } from '../../shared/ui/CoinBadge'
import { Mascot } from '../../shared/ui/Mascot'
import { Scene } from '../../shared/ui/Scene'

interface TimesUpStoppedScreenProps {
  snoozeCount: number
  bonus: number
  onPickMission: () => void
}

/** Shown right after "done"/"I'm done" on the times-up alarm — a small celebration for putting the phone down. */
export function TimesUpStoppedScreen({ snoozeCount, bonus, onPickMission }: TimesUpStoppedScreenProps) {
  const { t } = useTranslation()
  const stopLine = snoozeCount > 0 ? t('timesup.stopped_line_snoozed', { count: snoozeCount }) : t('timesup.stopped_line_plain')

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'var(--surface)', overflowY: 'auto' }}>
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px 56px', boxSizing: 'border-box' }}>
        <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative' }}>
          <Scene height={320} wide time="afternoon">
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 44, display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'relative' }}>
                <Celebration loop={false} spread={0.8} />
                <Mascot mood="proud" size={150} />
              </div>
            </div>
          </Scene>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: 28, gap: 8 }}>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 40, lineHeight: 1.1 }}>
            {t('timesup.stopped_title')}
          </h1>
          <p style={{ margin: 0, fontSize: 17, lineHeight: '25px', fontWeight: 600, color: 'var(--ink-muted)' }}>{stopLine}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <CoinBadge amount={bonus} reward />
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-muted)' }}>{t('timesup.stopped_bonus_label')}</span>
          </div>
          <div style={{ marginTop: 20, width: 280, maxWidth: '100%' }}>
            <Button variant="primary" block onClick={onPickMission}>
              {t('timesup.pick_mission')}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
