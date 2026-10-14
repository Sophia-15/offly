import { useCallback, useEffect, useState } from 'react'
import type { MascotCharacter, MascotMood } from '../../shared/ui/Mascot'

export type PomodoroPreset = '25' | '50'
export type PomodoroPhase = 'focus' | 'short' | 'long'

const PRESETS: Record<PomodoroPreset, { focus: number; short: number; long: number }> = {
  '25': { focus: 25, short: 5, long: 15 },
  '50': { focus: 50, short: 10, long: 20 },
}

export const FOCUS_ROUND_COINS = 5

interface PomodoroState {
  preset: PomodoroPreset
  phase: PomodoroPhase
  round: number
  left: number
  running: boolean
  task: string
  msg: string
  /** Increments each time a focus round completes; an effect watches this to fire the reward callback. */
  roundsCompleted: number
}

function durationFor(phase: PomodoroPhase, preset: PomodoroPreset): number {
  return PRESETS[preset][phase] * 60
}

export function usePomodoroTimer(onFocusRoundComplete: () => void) {
  const [state, setState] = useState<PomodoroState>({
    preset: '25',
    phase: 'focus',
    round: 1,
    left: durationFor('focus', '25'),
    running: false,
    task: '',
    msg: '',
    roundsCompleted: 0,
  })
  const [celebrating, setCelebrating] = useState(false)

  // Fires the reward side-effect outside the setState updater, which React may
  // invoke more than once per tick — reading/calling anything impure in there
  // would risk double-crediting coins.
  useEffect(() => {
    if (state.roundsCompleted === 0) return
    onFocusRoundComplete()
    setCelebrating(true)
    const id = setTimeout(() => setCelebrating(false), 2200)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.roundsCompleted])

  useEffect(() => {
    const id = setInterval(() => {
      setState((prev) => {
        if (!prev.running) return prev
        const left = prev.left - 1
        if (left > 0) return { ...prev, left }

        if (prev.phase === 'focus') {
          const next: PomodoroPhase = prev.round >= 4 ? 'long' : 'short'
          return {
            ...prev,
            phase: next,
            left: durationFor(next, prev.preset),
            running: false,
            msg: 'round_done',
            roundsCompleted: prev.roundsCompleted + 1,
          }
        }

        const nextRound = prev.phase === 'long' ? 1 : prev.round + 1
        return { ...prev, phase: 'focus', round: nextRound, left: durationFor('focus', prev.preset), running: false, msg: 'break_over' }
      })
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const toggle = useCallback(() => setState((p) => ({ ...p, running: !p.running, msg: '' })), [])
  const reset = useCallback(() => setState((p) => ({ ...p, left: durationFor(p.phase, p.preset), running: false, msg: '' })), [])
  const skip = useCallback(() => setState((p) => ({ ...p, left: 1, running: true })), [])
  const setPreset = useCallback(
    (preset: PomodoroPreset) =>
      setState((p) => ({ ...p, preset, phase: 'focus', round: 1, left: durationFor('focus', preset), running: false, task: '', msg: '' })),
    [],
  )
  const setTask = useCallback((task: string) => setState((p) => ({ ...p, task })), [])

  const total = durationFor(state.phase, state.preset)
  const focus = state.phase === 'focus'
  const character: MascotCharacter = focus ? 'leaf' : 'cloud'
  const mood: MascotMood = celebrating ? 'proud' : focus ? (state.running ? 'happy' : 'curious') : 'sleepy'
  const paused = !state.running && focus && state.left === total && state.round === 1 && state.msg === ''

  return {
    ...state,
    total,
    focus,
    character,
    mood,
    celebrating,
    paused,
    toggle,
    reset,
    skip,
    setPreset,
    setTask,
    presets: PRESETS,
  }
}
