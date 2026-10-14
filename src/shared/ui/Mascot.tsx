import type { CSSProperties, ReactNode } from 'react'

export type MascotCharacter = 'sun' | 'moon' | 'cloud' | 'tree' | 'leaf' | 'mushroom' | 'cactus' | 'fire' | 'tangerine'
export type MascotMood = 'happy' | 'curious' | 'sleepy' | 'proud' | 'neutral' | 'alarm'

const BLOB = 'M60 12C90 12 108 32 108 62C108 92 88 106 60 106C32 106 12 92 12 62C12 32 30 12 60 12Z'
const CLOUD = 'M34 104C19 104 10 93 14 80C4 74 5 55 20 52C17 35 33 23 48 30C56 15 82 15 88 31C103 28 116 42 109 57C119 65 115 87 100 92C99 101 90 107 81 103Z'
const CANOPY = 'M60 8C76 8 88 18 90 32C102 36 108 48 104 60C110 72 102 88 88 88H32C18 88 10 72 16 60C12 48 18 36 30 32C32 18 44 8 60 8Z'
const LEAF = 'M60 6C92 26 104 56 92 84C84 102 72 108 60 108C48 108 36 102 28 84C16 56 28 26 60 6Z'
const CAP = 'M8 64C8 30 32 10 60 10C88 10 112 30 112 64Q112 72 104 72H16Q8 72 8 64Z'
const STEM = 'M40 70H80L83 104Q83 111 75 111H45Q37 111 37 104Z'
const FLAME = 'M60 6C66 26 86 34 94 56C102 80 88 110 60 110C32 110 18 84 26 58C30 46 38 40 42 30C46 42 50 46 56 48C54 34 54 20 60 6Z'
const CORE = 'M60 54C64 64 77 70 77 86C77 98 69 104 60 104C51 104 43 98 43 86C43 76 51 70 54 62C56 68 58 68 60 54Z'

const NAMES: Record<string, string> = {
  sun: 'Pip', cloud: 'Puff', moon: 'Luna', tree: 'Sprout', leaf: 'Fern',
  mushroom: 'Mo', cactus: 'Spike', fire: 'Ember', tangerine: 'Tango',
}

function face(kids: ReactNode[], eyes: ReactNode[], fx: number, fy: number, s: number, mood: MascotMood) {
  const X = (d: number) => fx + d * s
  const Y = (d: number) => fy + d * s
  const key = kids.length

  kids.push(<ellipse key={`${key}-bl`} className="m-blush" cx={X(-28)} cy={Y(8)} rx={7.5 * s} ry={4.5 * s} />)
  kids.push(<ellipse key={`${key}-br`} className="m-blush" cx={X(28)} cy={Y(8)} rx={7.5 * s} ry={4.5 * s} />)

  if (mood === 'alarm') {
    ;[-16, 16].forEach((ox, i) => {
      eyes.push(<circle key={`${key}-e${i}`} className="m-white" cx={X(ox)} cy={Y(-8)} r={13.5 * s} />)
      eyes.push(<circle key={`${key}-p${i}`} className="m-iris" cx={X(ox)} cy={Y(-8)} r={5.5 * s} />)
      eyes.push(<circle key={`${key}-h${i}`} className="m-hilite" cx={X(ox + 2)} cy={Y(-10)} r={2 * s} />)
      kids.push(
        <path
          key={`${key}-b${i}`}
          className="m-line"
          d={`M${X(ox - 8)} ${Y(-26)}Q${X(ox)} ${Y(-31)} ${X(ox + 8)} ${Y(-26)}`}
          strokeWidth={3 * Math.max(s, 0.8)}
        />,
      )
    })
    kids.push(<ellipse key={`${key}-m`} className="m-mouth" cx={X(0)} cy={Y(18)} rx={6.5 * s} ry={8 * s} />)
    return
  }
  if (mood === 'happy' || mood === 'curious') {
    const dx = mood === 'curious' ? 2.5 : 1
    const dy = mood === 'curious' ? -2.5 : 1
    ;[-16, 16].forEach((ox, i) => {
      eyes.push(<circle key={`${key}-e${i}`} className="m-white" cx={X(ox)} cy={Y(-8)} r={12.5 * s} />)
      eyes.push(<circle key={`${key}-p${i}`} className="m-iris" cx={X(ox + dx)} cy={Y(-8 + dy)} r={8 * s} />)
      eyes.push(<circle key={`${key}-h${i}`} className="m-hilite" cx={X(ox + dx + 3)} cy={Y(-8 + dy - 3)} r={2.8 * s} />)
    })
    kids.push(
      mood === 'curious' ? (
        <ellipse key={`${key}-m`} className="m-mouth" cx={X(0)} cy={Y(17)} rx={4 * s} ry={5 * s} />
      ) : (
        <path
          key={`${key}-m`}
          className="m-line"
          d={`M${X(-9)} ${Y(14)}Q${X(0)} ${Y(22)} ${X(9)} ${Y(14)}`}
          strokeWidth={3.5 * Math.max(s, 0.8)}
        />
      ),
    )
  } else if (mood === 'sleepy') {
    ;[-16, 16].forEach((ox, i) => {
      kids.push(
        <path
          key={`${key}-e${i}`}
          className="m-line"
          d={`M${X(ox - 9)} ${Y(-6)}Q${X(ox)} ${Y(0)} ${X(ox + 9)} ${Y(-6)}`}
          strokeWidth={3.5 * Math.max(s, 0.8)}
        />,
      )
    })
    kids.push(
      <path
        key={`${key}-m`}
        className="m-line"
        d={`M${X(-5)} ${Y(16)}Q${X(0)} ${Y(19)} ${X(5)} ${Y(16)}`}
        strokeWidth={3 * Math.max(s, 0.8)}
      />,
    )
  } else {
    ;[-16, 16].forEach((ox, i) => {
      kids.push(
        <path
          key={`${key}-e${i}`}
          className="m-line"
          d={`M${X(ox - 9)} ${Y(-5)}Q${X(ox)} ${Y(-15)} ${X(ox + 9)} ${Y(-5)}`}
          strokeWidth={4 * Math.max(s, 0.8)}
        />,
      )
    })
    kids.push(
      <path
        key={`${key}-m`}
        className="m-mouth"
        d={`M${X(-12)} ${Y(9)}L${X(12)} ${Y(9)}Q${X(11)} ${Y(25)} ${X(0)} ${Y(25)}Q${X(-11)} ${Y(25)} ${X(-12)} ${Y(9)}Z`}
      />,
    )
  }
}

function feet(kids: ReactNode[], cls: string) {
  kids.push(<ellipse key="f1" className={cls} cx={46} cy={107} rx={9} ry={5.5} strokeWidth={3} />)
  kids.push(<ellipse key="f2" className={cls} cx={74} cy={107} rx={9} ry={5.5} strokeWidth={3} />)
}

// Per-character idle particle effects (sparks, rain, spores…), looping via CSS.
const STAR4 = (x: number, y: number, r: number) =>
  `M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z`

type FxTag = 'circle' | 'path' | 'ellipse'
type FxAttrs = Record<string, number | string>
type FxStyle = CSSProperties & { '--x'?: string }

function fx(ch: MascotCharacter): ReactNode[] {
  const out: ReactNode[] = []
  function add(Tag: FxTag, cls: string, attrs: FxAttrs, style: FxStyle) {
    out.push(<Tag key={`fx${out.length}`} className={`m-fx-p ${cls}`} style={style} {...attrs} />)
  }
  if (ch === 'fire') {
    ;([[56, 14, 2.6, '-10px', '0s'], [64, 18, 2, '9px', '.5s'], [60, 10, 1.8, '2px', '1s'], [52, 22, 1.6, '-14px', '1.4s'], [68, 24, 2.2, '13px', '.8s']] as const).forEach((p) => {
      add('circle', `m-spark ${p[2] > 2 ? 'm-spark-sun' : 'm-spark-tan'}`, { cx: p[0], cy: p[1], r: p[2] }, { '--x': p[3], animationDelay: p[4] })
    })
  } else if (ch === 'sun') {
    ;([[8, 18, 6, '0s'], [112, 30, 5, '.7s'], [104, 104, 4.5, '1.3s'], [14, 96, 4, '1.9s']] as const).forEach((p) => {
      add('path', 'm-twinkle m-tw-sun', { d: STAR4(p[0], p[1], p[2]) }, { animationDelay: p[3] })
    })
  } else if (ch === 'moon') {
    ;([[6, 20, 5, '0s'], [114, 40, 4, '.9s'], [108, 8, 3, '1.6s'], [10, 84, 3.5, '2.2s']] as const).forEach((p) => {
      add('path', 'm-twinkle m-tw-moon', { d: STAR4(p[0], p[1], p[2]) }, { animationDelay: p[3] })
    })
  } else if (ch === 'cloud') {
    ;([[40, 104, '0s'], [60, 108, '.6s'], [80, 104, '1.2s'], [50, 106, '1.8s']] as const).forEach((p) => {
      add('path', 'm-drop', { d: `M${p[0]} ${p[1]}q-3 5 0 7q3-2 0-7z` }, { animationDelay: p[2] })
    })
  } else if (ch === 'tree') {
    ;([[24, 60, '-8px', '0s'], [96, 50, '10px', '1.4s'], [80, 80, '6px', '2.6s']] as const).forEach((p) => {
      add('path', 'm-fall-leaf', { d: `M${p[0]} ${p[1]}q5-6 10 0q-5 6-10 0z` }, { '--x': p[2], animationDelay: p[3] })
    })
  } else if (ch === 'leaf') {
    ;([[2, 40, '0s'], [96, 70, '1s'], [0, 90, '2s']] as const).forEach((p) => {
      add('path', 'm-wind', { d: `M${p[0]} ${p[1]}q8-6 16 0t16 0`, strokeWidth: 2.6 }, { animationDelay: p[2] })
    })
  } else if (ch === 'mushroom') {
    ;([[30, 30, 2.4, '-6px', '0s'], [90, 26, 2, '7px', '.8s'], [60, 8, 1.8, '-3px', '1.5s'], [104, 44, 1.6, '5px', '2.1s'], [16, 46, 1.8, '-5px', '1.1s']] as const).forEach((p) => {
      add('circle', 'm-spore', { cx: p[0], cy: p[1], r: p[2] }, { '--x': p[3], animationDelay: p[4] })
    })
  } else if (ch === 'cactus') {
    ;([[60, 8, '-12px', '0s'], [60, 8, '10px', '1.1s'], [60, 8, '2px', '2.2s']] as const).forEach((p) => {
      add('ellipse', 'm-petal', { cx: p[0], cy: p[1], rx: 3, ry: 1.8 }, { '--x': p[2], animationDelay: p[3] })
    })
    add('path', 'm-twinkle m-tw-sun', { d: STAR4(108, 20, 4) }, { animationDelay: '.5s' })
  }
  return out
}

interface MascotProps {
  character?: MascotCharacter
  mood?: MascotMood
  size?: number
  label?: string
  /** Set false to freeze the idle body/mood animation (e.g. in a tight list). */
  animate?: boolean
  /** Set false to hide the looping particle effects (sparks, rain, spores…). */
  effects?: boolean
}

export function Mascot({ character = 'sun', mood = 'happy', size = 120, label, animate = true, effects = true }: MascotProps) {
  const ch = character
  const kids: ReactNode[] = []
  const eyes: ReactNode[] = []
  const rays: ReactNode[] = []
  let f: [number, number, number] = [60, 66, 1]

  if (ch === 'sun') {
    for (let r = 0; r < 8; r++) {
      const a = (r * Math.PI) / 4 + Math.PI / 8
      const c1 = Math.cos(a)
      const s1 = Math.sin(a)
      rays.push(
        <line key={`ray${r}`} className="m-ray" x1={60 + c1 * 47} y1={60 + s1 * 47} x2={60 + c1 * 56} y2={60 + s1 * 56} strokeWidth={7} />,
      )
    }
    kids.push(<circle key="b" className="m-sun" cx={60} cy={60} r={41} strokeWidth={3.5} />)
    f = [60, 64, 0.88]
  } else if (ch === 'tangerine' || ch === 'cloud') {
    const cls = `m-${ch}`
    feet(kids, cls)
    kids.push(<path key="b" className={cls} d={ch === 'cloud' ? CLOUD : BLOB} strokeWidth={3.5} />)
  } else if (ch === 'moon') {
    feet(kids, 'm-moon')
    kids.push(<circle key="b" className="m-moon" cx={60} cy={60} r={47} strokeWidth={3.5} />)
    ;[[86, 34, 6], [30, 42, 4], [90, 82, 5], [40, 92, 3.5]].forEach((c, i) => {
      kids.push(<circle key={`cr${i}`} className="m-crater" cx={c[0]} cy={c[1]} r={c[2]} />)
    })
    f = [58, 64, 0.95]
  } else if (ch === 'tree') {
    kids.push(<rect key="t" className="m-trunk" x={49} y={80} width={22} height={31} rx={6} strokeWidth={3.5} />)
    kids.push(<path key="b" className="m-canopy" d={CANOPY} strokeWidth={3.5} />)
    kids.push(<circle key="a1" className="m-apple" cx={30} cy={46} r={4.5} />)
    kids.push(<circle key="a2" className="m-apple" cx={92} cy={70} r={4.5} />)
    f = [60, 54, 0.88]
  } else if (ch === 'leaf') {
    kids.push(<path key="st" className="m-vein" d="M60 106V116" strokeWidth={4} />)
    kids.push(<path key="b" className="m-leaf" d={LEAF} strokeWidth={3.5} />)
    kids.push(<path key="v" className="m-vein" d="M60 18V42" strokeWidth={3} />)
    f = [60, 70, 0.85]
  } else if (ch === 'mushroom') {
    kids.push(<path key="st" className="m-stem" d={STEM} strokeWidth={3.5} />)
    kids.push(<path key="b" className="m-cap" d={CAP} strokeWidth={3.5} />)
    ;[[24, 52, 6], [97, 50, 7], [40, 24, 5], [82, 22, 5.5]].forEach((c, i) => {
      kids.push(<circle key={`d${i}`} className="m-spot" cx={c[0]} cy={c[1]} r={c[2]} />)
    })
    f = [60, 46, 0.8]
  } else if (ch === 'cactus') {
    const parts: [string, Record<string, number>][] = [
      ['rect', { x: 12, y: 40, width: 20, height: 40, rx: 10 }],
      ['rect', { x: 20, y: 64, width: 26, height: 16, rx: 8 }],
      ['rect', { x: 88, y: 28, width: 20, height: 40, rx: 10 }],
      ['rect', { x: 74, y: 52, width: 26, height: 16, rx: 8 }],
      ['rect', { x: 34, y: 14, width: 52, height: 97, rx: 26 }],
    ]
    parts.forEach((p, i) => {
      kids.push(<rect key={`o${i}`} className="m-cactus-line" strokeWidth={7} {...p[1]} />)
    })
    parts.forEach((p, i) => {
      kids.push(<rect key={`i${i}`} className="m-cactus" {...p[1]} />)
    })
    kids.push(<circle key="fl" className="m-flower" cx={60} cy={13} r={7} />)
    kids.push(<circle key="fc" className="m-flower-c" cx={60} cy={13} r={2.5} />)
    f = [60, 58, 0.85]
  } else if (ch === 'fire') {
    kids.push(<path key="b" className="m-fire" d={FLAME} strokeWidth={3.5} />)
    kids.push(<path key="c" className="m-core" d={CORE} />)
    f = [60, 80, 0.72]
  }

  face(kids, eyes, f[0], f[1], f[2], mood)
  const name = NAMES[ch] ?? 'Pip'

  const inner: ReactNode[] = []
  if (rays.length) inner.push(<g key="rays" className="m-rays">{rays}</g>)
  inner.push(...kids)
  if (eyes.length) inner.push(<g key="eyes" className="m-eyes">{eyes}</g>)

  const extra =
    mood === 'sleepy' ? (
      <g key="zz" className="m-zz">
        <path className="m-z m-z1" d="M92 22h8l-8 8h8" strokeWidth={2.6} />
        <path className="m-z m-z2" d="M102 6h6l-6 6h6" strokeWidth={2.2} />
      </g>
    ) : null

  const waves =
    mood === 'alarm' ? (
      <g key="wv" className="m-waves">
        <path className="m-wave m-wave1" d="M8 46Q0 60 8 74" strokeWidth={4} />
        <path className="m-wave m-wave2" d="M-2 38Q-14 60 -2 82" strokeWidth={4} />
        <path className="m-wave m-wave1" d="M112 46Q120 60 112 74" strokeWidth={4} />
        <path className="m-wave m-wave2" d="M122 38Q134 60 122 82" strokeWidth={4} />
      </g>
    ) : null

  const still = !animate
  const classes = ['mascot', `mascot-c-${ch}`, `mascot-mood-${mood}`, still ? 'mascot-still' : ''].filter(Boolean).join(' ')

  return (
    <svg className={classes} viewBox="0 0 120 120" width={size} height={size} role="img" aria-label={label ?? `${name}, the ${ch}, looking ${mood}`}>
      <g className="m-mood">
        <g className="m-char">{inner}</g>
      </g>
      {effects && mood !== 'alarm' && <g className="m-fx">{fx(ch)}</g>}
      {extra}
      {waves}
    </svg>
  )
}
