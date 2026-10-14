// Soft, synthesized chimes for the times-up alarm — deliberately gentle (short,
// low-gain sine tones), not a harsh beep. No audio assets: everything here is
// generated with the Web Audio API so the app stays fully self-contained.

type ChimeKind = 'nudge' | 'stage2' | 'stage3' | 'drain'

let ctx: AudioContext | null = null

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  if (!ctx) ctx = new Ctor()
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function tone(audio: AudioContext, startAt: number, freq: number, durationSec: number, peakGain: number) {
  const osc = audio.createOscillator()
  const gain = audio.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(freq, startAt)
  gain.gain.setValueAtTime(0, startAt)
  gain.gain.linearRampToValueAtTime(peakGain, startAt + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + durationSec)
  osc.connect(gain)
  gain.connect(audio.destination)
  osc.start(startAt)
  osc.stop(startAt + durationSec + 0.02)
}

const GAIN = 0.12

/** Plays a short, soft chime. Safe to call freely — no-ops without a user gesture yet or in unsupported browsers. */
export function playChime(kind: ChimeKind): void {
  const audio = getContext()
  if (!audio) return
  const t0 = audio.currentTime
  switch (kind) {
    case 'nudge':
      tone(audio, t0, 740, 0.22, GAIN)
      tone(audio, t0 + 0.11, 880, 0.26, GAIN)
      break
    case 'stage2':
      tone(audio, t0, 660, 0.2, GAIN)
      tone(audio, t0 + 0.1, 740, 0.2, GAIN)
      tone(audio, t0 + 0.2, 880, 0.3, GAIN)
      break
    case 'stage3':
      tone(audio, t0, 880, 0.18, GAIN)
      tone(audio, t0 + 0.09, 740, 0.18, GAIN)
      tone(audio, t0 + 0.18, 620, 0.3, GAIN)
      break
    case 'drain':
      tone(audio, t0, 520, 0.14, GAIN * 0.8)
      break
  }
}

/** Call from a user-gesture handler once so the AudioContext is unlocked on browsers that require it (notably iOS Safari). */
export function primeAudio(): void {
  getContext()
}
