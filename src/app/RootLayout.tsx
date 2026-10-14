import { useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useNavigate } from '@tanstack/react-router'
import { MissionCompletePage } from '../widgets/mission-complete/MissionCompletePage'
import { TimesUpStoppedScreen } from '../widgets/times-up-stopped/TimesUpStoppedScreen'
import { BottomNav } from '../widgets/nav-bar/BottomNav'
import { NavBar } from '../widgets/nav-bar/NavBar'
import { useApp } from './model/useApp'
import { ALARM_DONE_BONUS, ALARM_SNOOZE_BASE_COST, ALARM_SNOOZE_MINUTES } from '../features/times-up/model'
import { TimesUpCard } from '../features/times-up/TimesUpCard'
import { notifyTimesUp, startTitleFlash, stopTitleFlash, vibrateSoft } from '../shared/lib/alarmNotify'
import { playChime, primeAudio } from '../shared/lib/chime'
import { formatMinutesSeconds } from '../shared/lib/time'
import { Mascot } from '../shared/ui/Mascot'

export function RootLayout() {
  const { state, balance, streak, openUnlocks, activeAlarm, snoozeAlarm, dismissAlarm, completedTask, setCompletedTask, stoppedAlarm, setStoppedAlarm } =
    useApp()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  useEffect(() => {
    if (state.theme === 'system') {
      document.documentElement.removeAttribute('data-theme')
    } else {
      document.documentElement.setAttribute('data-theme', state.theme)
    }
  }, [state.theme])

  useEffect(() => {
    if (i18n.language !== state.language) {
      void i18n.changeLanguage(state.language)
    }
    document.documentElement.lang = state.language
  }, [state.language, i18n])

  // Unlocks AudioContext playback ahead of time — browsers require a user
  // gesture before sound can play, and the alarm's own chime isn't one.
  useEffect(() => {
    function once() {
      primeAudio()
      window.removeEventListener('pointerdown', once)
    }
    window.addEventListener('pointerdown', once)
    return () => window.removeEventListener('pointerdown', once)
  }, [])

  // Keeps bugging the person once time's up: a soft chime + short vibration on every
  // stage escalation, a flashing tab title the whole time, and (opt-in) a system
  // notification that re-fires every ~20s while the tab is backgrounded. This is the
  // practical ceiling for a backend-less app — Notification only reaches an open-but-
  // hidden tab; iOS Safari only allows it at all once added to the home screen.
  const alarmNudgeRef = useRef<{ unlockId: string; stage: number; lastNotifyAt: number } | null>(null)
  useEffect(() => {
    if (!activeAlarm) {
      stopTitleFlash()
      alarmNudgeRef.current = null
      return
    }
    const prev = alarmNudgeRef.current
    const isNewAlarm = !prev || prev.unlockId !== activeAlarm.unlock.id
    const stageIncreased = isNewAlarm || activeAlarm.stage > prev.stage
    const hiddenNow = document.hidden
    const dueForRenotify = hiddenNow && (isNewAlarm || Date.now() - (prev?.lastNotifyAt ?? 0) >= 20_000)

    if (stageIncreased) {
      playChime(activeAlarm.stage === 1 ? 'nudge' : activeAlarm.stage === 2 ? 'stage2' : 'stage3')
      vibrateSoft()
    }

    let lastNotifyAt = prev?.lastNotifyAt ?? 0
    if (state.notifyEnabled && (stageIncreased || dueForRenotify)) {
      const siteName = activeAlarm.unlock.siteName
      const body =
        activeAlarm.stage === 3
          ? t('timesup.notify_body_stage3')
          : activeAlarm.stage === 2
            ? t('timesup.notify_body_stage2', { minutes: activeAlarm.unlock.minutes })
            : t('timesup.notify_body_stage1')
      notifyTimesUp(activeAlarm.unlock.id, t('timesup.title', { app: siteName }), body)
      lastNotifyAt = Date.now()
    }

    alarmNudgeRef.current = { unlockId: activeAlarm.unlock.id, stage: activeAlarm.stage, lastNotifyAt }
    startTitleFlash(t('timesup.title_flash'))
  }, [activeAlarm, state.notifyEnabled, t])

  const cheapestSiteRate = useMemo(() => {
    if (state.sites.length === 0) return 0
    return Math.min(...state.sites.map((s) => s.ratePer5Min))
  }, [state.sites])

  function buysMinutesFor(coinBalance: number): number {
    if (cheapestSiteRate <= 0) return 0
    return Math.round((coinBalance * 5) / cheapestSiteRate)
  }

  function handleSnoozeAlarm() {
    if (!activeAlarm) return
    snoozeAlarm(activeAlarm.unlock.id, ALARM_SNOOZE_MINUTES[activeAlarm.stage])
  }

  function handleDoneAlarm() {
    if (!activeAlarm) return
    const { unlock } = activeAlarm
    dismissAlarm(unlock.id)
    setStoppedAlarm({ snoozeCount: unlock.snoozeCount ?? 0, bonus: ALARM_DONE_BONUS })
  }

  const completedTaskName = completedTask ? (completedTask.task.nameKey ? t(completedTask.task.nameKey) : completedTask.task.name) : ''

  const soonestOpenUnlock = useMemo(
    () => (openUnlocks.length === 0 ? null : openUnlocks.reduce((a, b) => (a.remainingSeconds < b.remainingSeconds ? a : b))),
    [openUnlocks],
  )

  return (
    <div style={{ minHeight: '100vh' }}>
      {completedTask && (
        <MissionCompletePage
          taskName={completedTaskName}
          points={completedTask.task.points}
          newBalance={completedTask.newBalance}
          streakCurrent={Math.max(streak.current, 1)}
          buysMinutes={buysMinutesFor(completedTask.newBalance)}
          onDismiss={() => setCompletedTask(null)}
        />
      )}
      <NavBar balance={balance} streak={streak.current} />
      <div className="page-content">
        <Outlet />
      </div>
      <BottomNav />

      {!completedTask && stoppedAlarm && (
        <TimesUpStoppedScreen
          snoozeCount={stoppedAlarm.snoozeCount}
          bonus={stoppedAlarm.bonus}
          onPickMission={() => {
            setStoppedAlarm(null)
            void navigate({ to: '/missions' })
          }}
        />
      )}

      {!completedTask && !stoppedAlarm && activeAlarm && activeAlarm.stage === 1 && (
        <div className="alarm-stage1-wrap">
          <TimesUpCard
            stage={1}
            appName={activeAlarm.unlock.siteName}
            minutes={activeAlarm.unlock.minutes}
            overBySeconds={activeAlarm.overBySeconds}
            drainedCoins={0}
            snoozeCost={activeAlarm.unlock.nextSnoozeCost ?? ALARM_SNOOZE_BASE_COST}
            snoozeDisabled={(activeAlarm.unlock.nextSnoozeCost ?? ALARM_SNOOZE_BASE_COST) > balance}
            onSnooze={handleSnoozeAlarm}
            onDone={handleDoneAlarm}
          />
        </div>
      )}
      {!completedTask && !stoppedAlarm && activeAlarm && activeAlarm.stage === 2 && (
        <div className="alarm-stage2-wrap alarm-dim">
          <div className="alarm-stage2-inner">
            <TimesUpCard
              stage={2}
              appName={activeAlarm.unlock.siteName}
              minutes={activeAlarm.unlock.minutes}
              overBySeconds={activeAlarm.overBySeconds}
              drainedCoins={0}
              snoozeCost={activeAlarm.unlock.nextSnoozeCost ?? ALARM_SNOOZE_BASE_COST}
              snoozeDisabled={(activeAlarm.unlock.nextSnoozeCost ?? ALARM_SNOOZE_BASE_COST) > balance}
              onSnooze={handleSnoozeAlarm}
              onDone={handleDoneAlarm}
            />
          </div>
        </div>
      )}
      {!completedTask && !stoppedAlarm && activeAlarm && activeAlarm.stage === 3 && (
        <div className="alarm-stage3-wrap alarm-takeover">
          <div className="alarm-stage3-inner">
            <TimesUpCard
              stage={3}
              appName={activeAlarm.unlock.siteName}
              minutes={activeAlarm.unlock.minutes}
              overBySeconds={activeAlarm.overBySeconds}
              drainedCoins={activeAlarm.drainedCoins}
              snoozeCost={activeAlarm.unlock.nextSnoozeCost ?? ALARM_SNOOZE_BASE_COST}
              snoozeDisabled={(activeAlarm.unlock.nextSnoozeCost ?? ALARM_SNOOZE_BASE_COST) > balance}
              onSnooze={handleSnoozeAlarm}
              onDone={handleDoneAlarm}
            />
          </div>
        </div>
      )}

      {!completedTask && !stoppedAlarm && !activeAlarm && soonestOpenUnlock && (
        <div className="alarm-watch-pill" role="timer">
          <Mascot character="sun" mood="happy" size={26} effects={false} label="Offly" />
          {t('timesup.watch_pill', { site: soonestOpenUnlock.siteName, time: formatMinutesSeconds(soonestOpenUnlock.remainingSeconds) })}
        </div>
      )}
    </div>
  )
}
