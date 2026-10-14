import type { CSSProperties, ReactNode } from 'react'
import { createElement as h } from 'react'

export type TimeOfDay = 'dawn' | 'morning' | 'afternoon' | 'dusk' | 'night'
export type SceneTime = TimeOfDay | 'auto'

interface TimeConfig {
  vars: CSSProperties
  sun: [number, number]
  sunW: [number, number]
  glow: boolean
  stars: 'faint' | 'full' | null
  dark: boolean
  moon?: boolean
}

const TIMES: Record<TimeOfDay, TimeConfig> = {
  dawn: {
    vars: { '--sky': '#dccdf3', '--sky-far': '#bca9e6', '--grass': '#8cc98c', '--grass-deep': '#5daf76', '--cloud': '#fff0f4', '--scene-sun': '#ffae7d', '--scene-glow': '#ffc6b6' } as CSSProperties,
    sun: [64, 214],
    sunW: [200, 196],
    glow: true,
    stars: 'faint',
    dark: false,
  },
  morning: {
    vars: { '--sky': '#d8f0ff', '--sky-far': '#b5dfff', '--grass': '#9be38a', '--grass-deep': '#62c66e', '--cloud': '#ffffff', '--scene-sun': '#ffe066', '--scene-glow': '#fff4c9' } as CSSProperties,
    sun: [86, 112],
    sunW: [300, 96],
    glow: true,
    stars: null,
    dark: false,
  },
  afternoon: {
    vars: {},
    sun: [336, 178],
    sunW: [960, 160],
    glow: false,
    stars: null,
    dark: false,
  },
  dusk: {
    vars: { '--sky': '#ffc9a3', '--sky-far': '#f4a596', '--grass': '#86b977', '--grass-deep': '#5f9a66', '--cloud': '#fff0e2', '--scene-sun': '#ff7a45', '--scene-glow': '#ff9f80' } as CSSProperties,
    sun: [324, 208],
    sunW: [1000, 196],
    glow: true,
    stars: null,
    dark: false,
  },
  night: {
    vars: {
      '--sky': '#1b2a66',
      '--sky-far': '#2a3c86',
      '--grass': '#2c6f47',
      '--grass-deep': '#1f5a37',
      '--cloud': '#3a4c94',
      '--scene-ink': '#ffffff',
      '--scene-ink-muted': 'rgba(255, 255, 255, 0.78)',
    } as CSSProperties,
    sun: [336, 172],
    sunW: [975, 152],
    glow: false,
    stars: 'full',
    dark: true,
    moon: true,
  },
}

export function timeOfDay(date: Date = new Date()): TimeOfDay {
  const hr = date.getHours()
  if (hr >= 5 && hr < 7) return 'dawn'
  if (hr >= 7 && hr < 11) return 'morning'
  if (hr >= 11 && hr < 17) return 'afternoon'
  if (hr >= 17 && hr < 19) return 'dusk'
  return 'night'
}

export function resolveTime(t: SceneTime | undefined): TimeOfDay {
  if (t === 'auto' || t === undefined) return timeOfDay()
  if (!TIMES[t]) return 'afternoon'
  return t
}

export function isDarkTime(t: SceneTime | undefined): boolean {
  return TIMES[resolveTime(t)].dark
}

export function timeVars(t: SceneTime | undefined): CSSProperties {
  return TIMES[resolveTime(t)].vars
}

const WIDE_STAR_POINTS: [number, number][] = [[60, 40], [150, 120], [240, 60], [330, 150], [420, 30], [520, 100], [610, 50], [700, 140], [800, 70], [880, 30], [1060, 90], [1140, 40], [1180, 140], [90, 170]]
const NARROW_STAR_POINTS: [number, number][] = [[48, 40], [110, 120], [170, 30], [236, 96], [300, 60], [60, 160], [360, 110]]

export function sceneArt(wide: boolean, key: TimeOfDay): ReactNode[] {
  const T = TIMES[key]
  const art: ReactNode[] = []
  const [sx, sy] = wide ? T.sunW : T.sun
  const horizon = wide ? 196 : 206

  if (T.glow) {
    art.push(h('ellipse', { key: 'glow1', className: 's-glow', cx: sx, cy: horizon, rx: wide ? 560 : 280, ry: wide ? 120 : 104 }))
    art.push(h('ellipse', { key: 'glow2', className: 's-glow', cx: sx, cy: horizon, rx: wide ? 360 : 180, ry: wide ? 80 : 70 }))
  }

  if (T.stars) {
    let pts = wide ? WIDE_STAR_POINTS : NARROW_STAR_POINTS
    if (T.stars === 'faint') pts = pts.filter((p, i) => i % 2 === 0 && p[0] > (wide ? 500 : 150))
    pts.forEach((p, i) => {
      art.push(h('circle', { key: `st${i}`, className: `s-star${T.stars === 'faint' ? ' s-star-faint' : ''}`, cx: p[0], cy: p[1], r: i % 3 ? 1.6 : 2.4 }))
    })
  }

  if (!T.moon) art.push(h('circle', { key: 'halo', className: 's-halo', cx: sx, cy: sy, r: wide ? 56 : 46 }))
  art.push(h('circle', { key: 'sun', className: 's-sun', cx: sx, cy: sy, r: wide ? 34 : 28 }))
  if (T.moon) art.push(h('circle', { key: 'moon', style: { fill: 'var(--sky)' }, cx: sx + (wide ? 15 : 12), cy: sy - (wide ? 12 : 10), r: wide ? 29 : 24 }))

  if (!T.moon) {
    const clouds: [number, number, number][] = wide ? [[90, 110, 1], [400, 46, 0.85], [690, 120, 1], [1060, 60, 0.85]] : [[22, 132, 1], [150, 26, 0.85]]
    clouds.forEach((c, i) => {
      const [x, y, opacity] = c
      const k = wide ? (i % 2 ? 0.7 : 1) : i ? 0.6 : 0.96
      art.push(
        h(
          'g',
          { key: `c${i}`, className: 's-cloud', opacity },
          h('rect', { key: 'r', x, y, width: 96 * k, height: 22 * k, rx: 11 * k }),
          h('circle', { key: 'c1', cx: x + 30 * k, cy: y - 2 * k, r: 16 * k }),
          h('circle', { key: 'c2', cx: x + 58 * k, cy: y - 6 * k, r: 20 * k }),
        ),
      )
    })
  }

  if (wide) {
    art.push(h('path', { key: 'far', className: 's-far', d: 'M0 200Q200 150 420 190T840 182T1200 172V320H0Z' }))
    art.push(h('path', { key: 'near', className: 's-grass', d: 'M0 242Q260 202 520 236T1040 228T1200 238V320H0Z' }))
    ;[[70, 238, 22], [102, 244, 15], [640, 232, 18], [664, 238, 12], [1110, 226, 22], [1140, 234, 15]].forEach((b, i) => {
      art.push(h('circle', { key: `bu${i}`, className: 's-deep', cx: b[0], cy: b[1], r: b[2] }))
    })
  } else {
    art.push(h('path', { key: 'far', className: 's-far', d: 'M0 212Q90 166 196 204T390 194V320H0Z' }))
    art.push(h('path', { key: 'near', className: 's-grass', d: 'M0 246Q120 206 236 240T390 232V320H0Z' }))
    ;[[38, 236, 18], [62, 242, 13], [346, 226, 20], [370, 232, 14]].forEach((b, i) => {
      art.push(h('circle', { key: `bu${i}`, className: 's-deep', cx: b[0], cy: b[1], r: b[2] }))
    })
  }

  return art
}
