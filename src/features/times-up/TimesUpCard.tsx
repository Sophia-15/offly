import { useTranslation } from 'react-i18next'
import { ALARM_DRAIN_INTERVAL_SECONDS } from './model'
import { Button } from '../../shared/ui/Button'
import { Coin } from '../../shared/ui/Coin'
import { Mascot } from '../../shared/ui/Mascot'

function fmtOver(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${r < 10 ? '0' : ''}${r}`
}

interface TimesUpCardProps {
  stage: 1 | 2 | 3
  appName: string
  minutes: number
  overBySeconds: number
  drainedCoins: number
  snoozeCost: number
  snoozeDisabled: boolean
  onSnooze: () => void
  onDone: () => void
}

/** The times-up alarm: escalates in three stages until the person stops —
 *  1 a nudge card, 2 a bigger card over a dimmed screen, 3 a full takeover that drains coins. */
export function TimesUpCard({ stage, appName, minutes, overBySeconds, drainedCoins, snoozeCost, snoozeDisabled, onSnooze, onDone }: TimesUpCardProps) {
  const { t } = useTranslation()

  const snooze = (
    <Button variant="ghost" size={stage === 1 ? 'sm' : undefined} block={stage > 1} onClick={onSnooze} disabled={snoozeDisabled}>
      {stage === 3 ? t('timesup.snooze_5') : stage === 2 ? t('timesup.snooze_1_more') : t('timesup.snooze_1')}
      <Coin size={18} />
      {snoozeCost}
    </Button>
  )
  const done = (
    <Button variant="primary" size={stage === 1 ? 'sm' : undefined} block={stage > 1} onClick={onDone}>
      {stage === 3 ? t('timesup.done') : t('timesup.close', { app: appName })}
    </Button>
  )

  if (stage === 1) {
    return (
      <div className="alarm alarm-1" role="alert">
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <Mascot mood="alarm" size={54} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16 }}>{t('timesup.title', { app: appName })}</p>
            <p className="alarm-sub">{t('timesup.nudge_sub')}</p>
          </div>
        </div>
        <div className="alarm-actions">
          {snooze}
          {done}
        </div>
      </div>
    )
  }

  if (stage === 2) {
    return (
      <div className="alarm alarm-2" role="alertdialog" aria-label={t('timesup.aria_label')}>
        <div className="alarm-hero">
          <span className="alarm-ring" />
          <span className="alarm-ring alarm-ring-2" />
          <Mascot mood="alarm" size={100} />
        </div>
        <h2 className="alarm-title">{t('timesup.stage2_title', { minutes })}</h2>
        <p className="alarm-sub">{t('timesup.stage2_sub', { over: fmtOver(overBySeconds) })}</p>
        <div className="alarm-stack">
          {done}
          {snooze}
        </div>
      </div>
    )
  }

  return (
    <div className="alarm alarm-3" role="alertdialog" aria-label={t('timesup.still_scrolling_aria')}>
      <div className="alarm-hero">
        <span className="alarm-ring" />
        <span className="alarm-ring alarm-ring-2" />
        <span className="alarm-ring alarm-ring-3" />
        <Mascot mood="alarm" size={150} />
      </div>
      <h2 className="alarm-title alarm-title-lg">{t('timesup.stage3_title')}</h2>
      <p className="alarm-sub">{t('timesup.stage3_sub', { over: fmtOver(overBySeconds) })}</p>
      {drainedCoins > 0 && (
        <p className="alarm-drain">
          <Coin size={18} />
          {t('timesup.drain_line', { coins: drainedCoins, seconds: ALARM_DRAIN_INTERVAL_SECONDS })}
        </p>
      )}
      <div className="alarm-stack">
        {done}
        {snooze}
      </div>
    </div>
  )
}
