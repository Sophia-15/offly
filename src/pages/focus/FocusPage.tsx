import { useTranslation } from 'react-i18next'
import type { CompletionEntry } from '../../entities/task/model'
import { FOCUS_ROUND_COINS, usePomodoroTimer } from '../../features/pomodoro/usePomodoroTimer'
import { Bubble } from '../../shared/ui/Bubble'
import { Button } from '../../shared/ui/Button'
import { Celebration } from '../../shared/ui/Celebration'
import { Coin } from '../../shared/ui/Coin'
import { Icon } from '../../shared/ui/Icon'
import { Mascot } from '../../shared/ui/Mascot'
import { Scene } from '../../shared/ui/Scene'
import { Segmented } from '../../shared/ui/Segmented'
import { Timer } from '../../shared/ui/Timer'

interface FocusPageProps {
  completions: CompletionEntry[]
  onFocusRoundComplete: () => void
}

function todayKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

export function FocusPage({ completions, onFocusRoundComplete }: FocusPageProps) {
  const { t } = useTranslation()
  const timer = usePomodoroTimer(onFocusRoundComplete)

  const todaysRounds = completions.filter((c) => {
    const d = new Date(c.completedAt)
    return c.taskId === 'focus-round' && `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}` === todayKey()
  })
  const done = todaysRounds.length
  const coinsToday = todaysRounds.reduce((sum, c) => sum + c.points, 0)
  const minutes = done * timer.presets[timer.preset].focus

  const dots = [1, 2, 3, 4].map((n) => {
    const filled = n < timer.round || (n === timer.round && !timer.focus)
    const current = n === timer.round && timer.focus
    return { filled, current }
  })

  const line = timer.paused
    ? t('focus.line_paused')
    : timer.focus
      ? t(`focus.line_focus_${((timer.round - 1) % 3) + 1}`)
      : t(`focus.line_${timer.phase}`)

  const phaseLabel =
    timer.phase === 'focus' ? t('focus.phase_focus', { round: timer.round }) : timer.phase === 'long' ? t('focus.phase_long') : t('focus.phase_short')
  const timerLabel = timer.focus ? t('focus.timer_label_focus') : t('focus.timer_label_break')
  const startLabel = timer.running ? t('focus.pause') : timer.left < timer.total ? t('focus.resume') : timer.focus ? t('focus.start_focus') : t('focus.start_break')

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '16px 24px 56px', boxSizing: 'border-box' }}>
      <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative' }}>
        <Scene height={420} wide />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 18,
            padding: 24,
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              height: 36,
              padding: '0 16px',
              borderRadius: 999,
              background: 'var(--surface-raised)',
              color: 'var(--blue)',
              fontSize: 15,
              fontWeight: 800,
              boxShadow: 'var(--shadow-edge)',
            }}
          >
            {phaseLabel}
          </span>
          <div style={{ borderRadius: 999, boxShadow: 'var(--shadow-float)' }}>
            <Timer secondsLeft={timer.left} totalSeconds={timer.total} size={220} label={timerLabel} tone={timer.focus ? 'blue' : undefined} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
            <button type="button" className="icon-btn" onClick={timer.reset} aria-label={t('focus.restart_aria')}>
              <Icon name="restart" size={22} />
            </button>
            <div style={{ width: 190 }}>
              <Button variant="primary" block onClick={timer.toggle}>
                <Icon name={timer.running ? 'pause' : 'play'} size={20} />
                {startLabel}
              </Button>
            </div>
            <button type="button" className="icon-btn" onClick={timer.skip} aria-label={t('focus.skip_aria')}>
              <Icon name="skip" size={22} />
            </button>
          </div>
        </div>
        <div style={{ position: 'absolute', right: '7%', bottom: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <Bubble>{line}</Bubble>
          <div style={{ position: 'relative' }}>
            {timer.celebrating && <Celebration loop={false} spread={0.9} />}
            <Mascot character={timer.character} mood={timer.mood} size={110} />
          </div>
        </div>
      </div>

      {timer.msg && (
        <p role="status" style={{ margin: '14px 0 0', textAlign: 'center', fontSize: 15, fontWeight: 800, color: 'var(--mint-deep)' }}>
          {timer.msg === 'round_done' ? t('focus.msg_round_done', { coins: FOCUS_ROUND_COINS }) : t('focus.msg_break_over')}
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14, marginTop: 20, alignItems: 'start' }}>
        <section className="card">
          <label className="field-label" htmlFor="focus-task">
            {t('focus.task_label')}
          </label>
          <input
            id="focus-task"
            className="field-input"
            value={timer.task}
            onChange={(e) => timer.setTask(e.target.value)}
            placeholder={t('focus.task_placeholder')}
          />
        </section>
        <section className="card">
          <span className="field-label">{t('focus.timer_length_label')}</span>
          <Segmented
            ariaLabel={t('focus.timer_length_label')}
            value={timer.preset}
            onChange={(v) => timer.setPreset(v as '25' | '50')}
            options={[
              { value: '25', label: t('focus.preset_25') },
              { value: '50', label: t('focus.preset_50') },
            ]}
          />
          <p style={{ margin: '10px 0 0', fontSize: 13, lineHeight: '20px', fontWeight: 600, color: 'var(--ink-muted)' }}>
            {t('focus.timer_length_hint')}
          </p>
        </section>
        <section className="card">
          <span className="field-label">{t('focus.today_label')}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {dots.map((d, i) => (
              <span
                key={i}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 999,
                  background: d.filled ? 'var(--blue)' : d.current ? 'var(--blue-soft)' : 'var(--line)',
                  boxShadow: d.current ? 'inset 0 0 0 2px var(--blue)' : undefined,
                }}
              />
            ))}
          </div>
          <p style={{ margin: '10px 0 0', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, lineHeight: '20px', fontWeight: 700, color: 'var(--ink-muted)' }}>
            <Coin size={18} />
            {t('focus.stats_line', { done, minutes, coins: coinsToday })}
          </p>
        </section>
      </div>
    </main>
  )
}
