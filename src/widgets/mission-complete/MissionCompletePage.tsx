import { useTranslation } from 'react-i18next'
import { Button } from '../../shared/ui/Button'
import { Bubble } from '../../shared/ui/Bubble'
import { Celebration } from '../../shared/ui/Celebration'
import { Coin } from '../../shared/ui/Coin'
import { Mascot } from '../../shared/ui/Mascot'
import { Scene } from '../../shared/ui/Scene'

interface MissionCompletePageProps {
  taskName: string
  points: number
  newBalance: number
  streakCurrent: number
  buysMinutes: number
  onDismiss: () => void
}

export function MissionCompletePage({ taskName, points, newBalance, streakCurrent, buysMinutes, onDismiss }: MissionCompletePageProps) {
  const { t } = useTranslation()

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 70,
        background: 'var(--surface)',
        overflowY: 'auto',
      }}
    >
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px 56px', boxSizing: 'border-box' }}>
        <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative' }}>
          <Scene height={320} wide>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 28, display: 'flex', justifyContent: 'center', padding: '0 20px' }}>
              <Bubble>{t('complete.bubble', { task: taskName })}</Bubble>
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 44, display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'relative' }}>
                <Celebration loop spread={1.3} />
                <Mascot mood="proud" size={150} />
              </div>
            </div>
          </Scene>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: 28 }}>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 40, lineHeight: 1.1 }}>
            {t('complete.title')}
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: 17, lineHeight: '25px', fontWeight: 600, color: 'var(--ink-muted)' }}>
            {t('complete.subtitle', { task: taskName })}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
            <Coin size={52} />
            <span className="pop-loop" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 64, lineHeight: 1 }}>
              +{points}
            </span>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 12,
              width: '100%',
              maxWidth: 620,
              marginTop: 24,
              textAlign: 'left',
            }}
          >
            <div className="card" style={{ gap: 2 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-muted)' }}>{t('complete.new_balance')}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 28 }}>{newBalance}</div>
            </div>
            <div className="card" style={{ gap: 2 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-muted)' }}>{t('complete.streak_label')}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 28 }}>
                <Mascot character="fire" mood="proud" size={30} label="Ember" />
                {t('me.day', { count: streakCurrent })}
              </div>
            </div>
            <div className="card" style={{ gap: 2 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-muted)' }}>{t('complete.buys_label')}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 28 }}>{t('unlocks.min_suffix', { count: buysMinutes })}</div>
            </div>
          </div>
          <div style={{ marginTop: 28, width: 280, maxWidth: '100%' }}>
            <Button variant="mint" block onClick={onDismiss}>
              {t('complete.dismiss')}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
