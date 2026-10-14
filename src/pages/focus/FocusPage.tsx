import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { CompletionEntry } from '../../entities/task/model'
import { FOCUS_ROUND_COINS, usePomodoroTimer } from '../../features/pomodoro/usePomodoroTimer'
import { Bubble } from '../../shared/ui/Bubble'
import { Button } from '../../shared/ui/Button'
import { Celebration } from '../../shared/ui/Celebration'
import { Coin } from '../../shared/ui/Coin'
import { CoinBadge } from '../../shared/ui/CoinBadge'
import { Icon } from '../../shared/ui/Icon'
import { Mascot } from '../../shared/ui/Mascot'
import { Scene } from '../../shared/ui/Scene'
import { Segmented } from '../../shared/ui/Segmented'
import { Timer } from '../../shared/ui/Timer'

interface FocusPageProps {
  completions: CompletionEntry[]
  balance: number
  onFocusRoundComplete: () => void
}

function todayKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

export function FocusPage({ completions, balance, onFocusRoundComplete }: FocusPageProps) {
  const { t } = useTranslation()
  const timer = usePomodoroTimer(onFocusRoundComplete)
  const [taskError, setTaskError] = useState(false)
  const taskInputRef = useRef<HTMLInputElement>(null)
  const taskInputRefMobile = useRef<HTMLInputElement>(null)

  function handleToggle() {
    if (!timer.running && timer.focus && !timer.task.trim()) {
      setTaskError(true)
      taskInputRef.current?.focus()
      taskInputRefMobile.current?.focus()
      return
    }
    setTaskError(false)
    timer.toggle()
  }

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

  const phasePill = (
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
        whiteSpace: 'nowrap',
      }}
    >
      {phaseLabel}
    </span>
  )

  const timerButtons = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
      <button type="button" className="icon-btn" onClick={timer.reset} aria-label={t('focus.restart_aria')}>
        <Icon name="restart" size={22} />
      </button>
      <div style={{ width: 190 }}>
        <Button variant="primary" block onClick={handleToggle}>
          <Icon name={timer.running ? 'pause' : 'play'} size={20} />
          {startLabel}
        </Button>
      </div>
      <button type="button" className="icon-btn" onClick={timer.skip} aria-label={t('focus.skip_aria')}>
        <Icon name="skip" size={22} />
      </button>
    </div>
  )

  const dotsRow = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
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
  )

  const msgText = timer.msg === 'round_done' ? t('focus.msg_round_done', { coins: FOCUS_ROUND_COINS }) : timer.msg === 'break_over' ? t('focus.msg_break_over') : null

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '16px 24px 56px', boxSizing: 'border-box' }}>
      {/* Wide layout: one landscape-format scene with phase/timer/buttons centered on it and the buddy on the right */}
      <div className="hide-mobile" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative' }}>
        <Scene height={420} wide>
          <div className="focus-overlay-controls">
            {phasePill}
            <div style={{ borderRadius: 999, boxShadow: 'var(--shadow-float)' }}>
              <Timer secondsLeft={timer.left} totalSeconds={timer.total} size={220} label={timerLabel} tone={timer.focus ? 'blue' : undefined} />
            </div>
            {timerButtons}
          </div>
          <div className="focus-overlay-companion">
            <Bubble>{line}</Bubble>
            <div style={{ position: 'relative' }}>
              {timer.celebrating && <Celebration loop={false} spread={0.9} />}
              <Mascot character={timer.character} mood={timer.mood} size={110} />
            </div>
          </div>
        </Scene>
      </div>

      {/* Phone layout: a narrow (not wide) scene — its own composition, not a crop of the wide one —
          used only as a backdrop for the title, balance, bubble and buddy; the controls live below it. */}
      <div className="show-mobile-flex" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative' }}>
        <Scene height={300}>
          <div style={{ display: 'flex', position: 'absolute', left: 20, right: 20, top: 56, alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 26, color: 'var(--scene-ink, var(--ink))' }}>{t('nav.focus')}</span>
            <CoinBadge amount={balance} />
          </div>
          <div style={{ position: 'absolute', left: 20, right: 130, top: 112 }}>
            <Bubble tail="left">{line}</Bubble>
          </div>
          <div style={{ position: 'absolute', right: 22, top: 104 }}>
            {timer.celebrating && <Celebration loop={false} spread={0.6} />}
            <Mascot character={timer.character} mood={timer.mood} size={104} />
          </div>
        </Scene>
      </div>

      {/* Phone layout: everything else lives in a sheet below the scene, not overlaid on it */}
      <div className="focus-sheet show-mobile-flex" style={{ flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
          {phasePill}
          <Segmented
            ariaLabel={t('focus.timer_length_label')}
            value={timer.preset}
            onChange={(v) => timer.setPreset(v as '25' | '50')}
            options={[
              { value: '25', label: t('focus.preset_25') },
              { value: '50', label: t('focus.preset_50') },
            ]}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Timer secondsLeft={timer.left} totalSeconds={timer.total} size={220} label={timerLabel} tone={timer.focus ? 'blue' : undefined} />
        </div>
        {dotsRow}
        {timerButtons}
        {msgText && (
          <p role="status" style={{ margin: 0, textAlign: 'center', fontSize: 14, fontWeight: 800, color: 'var(--mint-deep)' }}>
            {msgText}
          </p>
        )}
        <div>
          <label className="field-label" htmlFor="focus-task-mobile">
            {t('focus.task_label')}
          </label>
          <input
            ref={taskInputRefMobile}
            id="focus-task-mobile"
            className="field-input"
            value={timer.task}
            onChange={(e) => {
              timer.setTask(e.target.value)
              if (e.target.value.trim()) setTaskError(false)
            }}
            placeholder={t('focus.task_placeholder')}
            aria-invalid={taskError}
            style={taskError ? { outline: '3px solid var(--danger)', outlineOffset: 2 } : undefined}
          />
          {taskError && (
            <p role="alert" style={{ margin: '8px 0 0', fontSize: 13, fontWeight: 700, color: 'var(--danger)' }}>
              {t('focus.task_required')}
            </p>
          )}
        </div>
        <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, lineHeight: '20px', fontWeight: 700, color: 'var(--ink-muted)' }}>
          <Coin size={18} />
          {t('focus.stats_line', { done, minutes, coins: coinsToday })}
        </p>
      </div>

      {/* Wide layout: status message below the stage */}
      {msgText && (
        <p className="hide-mobile" role="status" style={{ margin: '14px 0 0', textAlign: 'center', fontSize: 15, fontWeight: 800, color: 'var(--mint-deep)' }}>
          {msgText}
        </p>
      )}

      {/* Wide layout: the three detail cards below the stage */}
      <div className="hide-mobile focus-desktop-grid">
        <section className="card">
          <label className="field-label" htmlFor="focus-task">
            {t('focus.task_label')}
          </label>
          <input
            ref={taskInputRef}
            id="focus-task"
            className="field-input"
            value={timer.task}
            onChange={(e) => {
              timer.setTask(e.target.value)
              if (e.target.value.trim()) setTaskError(false)
            }}
            placeholder={t('focus.task_placeholder')}
            aria-invalid={taskError}
            style={taskError ? { outline: '3px solid var(--danger)', outlineOffset: 2 } : undefined}
          />
          {taskError && (
            <p role="alert" style={{ margin: '8px 0 0', fontSize: 13, fontWeight: 700, color: 'var(--danger)' }}>
              {t('focus.task_required')}
            </p>
          )}
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
          {dotsRow}
          <p style={{ margin: '10px 0 0', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, lineHeight: '20px', fontWeight: 700, color: 'var(--ink-muted)' }}>
            <Coin size={18} />
            {t('focus.stats_line', { done, minutes, coins: coinsToday })}
          </p>
        </section>
      </div>
    </main>
  )
}
