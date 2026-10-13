import type { CSSProperties, ReactNode } from 'react'

interface SceneProps {
  height?: number | string
  time?: 'day' | 'night'
  wide?: boolean
  style?: CSSProperties
  children?: ReactNode
}

function wideArt(night: boolean): ReactNode[] {
  const art: ReactNode[] = [
    night ? null : <circle key="halo" className="s-halo" cx={960} cy={160} r={56} />,
    <circle key="sun" className="s-sun" cx={960} cy={160} r={34} />,
    night ? <circle key="moon" style={{ fill: 'var(--sky)' }} cx={975} cy={148} r={29} /> : null,
  ]

  if (night) {
    ;[[60, 40], [150, 120], [240, 60], [330, 150], [420, 30], [520, 100], [610, 50], [700, 140], [800, 70], [880, 30], [1060, 90], [1140, 40], [1180, 140], [90, 170]].forEach(
      (p, i) => {
        art.push(<circle key={`st${i}`} className="s-star" cx={p[0]} cy={p[1]} r={i % 3 ? 1.6 : 2.6} />)
      },
    )
  } else {
    ;[[90, 110, 1], [400, 46, 0.85], [690, 120, 1], [1060, 60, 0.85]].forEach((c, i) => {
      const x = c[0]
      const y = c[1]
      const k = i % 2 ? 0.7 : 1
      art.push(
        <g key={`c${i}`} className="s-cloud" opacity={c[2]}>
          <rect x={x} y={y} width={96 * k} height={22 * k} rx={11 * k} />
          <circle cx={x + 30 * k} cy={y - 2 * k} r={16 * k} />
          <circle cx={x + 58 * k} cy={y - 6 * k} r={20 * k} />
        </g>,
      )
    })
  }

  art.push(<path key="far" className="s-far" d="M0 200Q200 150 420 190T840 182T1200 172V320H0Z" />)
  art.push(<path key="near" className="s-grass" d="M0 242Q260 202 520 236T1040 228T1200 238V320H0Z" />)
  ;[[70, 238, 22], [102, 244, 15], [640, 232, 18], [664, 238, 12], [1110, 226, 22], [1140, 234, 15]].forEach((b, i) => {
    art.push(<circle key={`bu${i}`} className="s-deep" cx={b[0]} cy={b[1]} r={b[2]} />)
  })

  return art
}

export function Scene({ height = 300, time = 'day', wide = false, style, children }: SceneProps) {
  const night = time === 'night'

  const art: ReactNode[] = wide
    ? wideArt(night)
    : [
        night ? null : <circle key="halo" className="s-halo" cx={336} cy={178} r={46} />,
        <circle key="sun" className="s-sun" cx={336} cy={178} r={28} />,
        night ? <circle key="moon" style={{ fill: 'var(--sky)' }} cx={348} cy={168} r={24} /> : null,
      ]

  if (!wide) {
    if (night) {
      ;[[48, 40], [110, 120], [170, 30], [236, 96], [300, 60], [60, 160], [360, 110]].forEach((p, i) => {
        art.push(<circle key={`st${i}`} className="s-star" cx={p[0]} cy={p[1]} r={i % 2 ? 1.6 : 2.4} />)
      })
    } else {
      art.push(
        <g key="c1" className="s-cloud">
          <rect x={22} y={132} width={92} height={22} rx={11} />
          <circle cx={52} cy={130} r={16} />
          <circle cx={80} cy={126} r={20} />
        </g>,
      )
      art.push(
        <g key="c2" className="s-cloud" opacity={0.85}>
          <rect x={150} y={26} width={56} height={14} rx={7} />
          <circle cx={168} cy={25} r={10} />
          <circle cx={186} cy={23} r={12} />
        </g>,
      )
    }
    art.push(<path key="far" className="s-far" d="M0 212Q90 166 196 204T390 194V320H0Z" />)
    art.push(<path key="near" className="s-grass" d="M0 246Q120 206 236 240T390 232V320H0Z" />)
    ;[[38, 236, 18], [62, 242, 13], [346, 226, 20], [370, 232, 14]].forEach((b, i) => {
      art.push(<circle key={`bu${i}`} className="s-deep" cx={b[0]} cy={b[1]} r={b[2]} />)
    })
  }

  const nightVars: CSSProperties = night
    ? ({ '--sky': '#1b2a66', '--sky-far': '#2a3c86', '--grass': '#2c6f47', '--grass-deep': '#1f5a37', '--cloud': '#3a4c94' } as CSSProperties)
    : {}

  return (
    <div className="scene" style={{ height, ...nightVars, ...style }}>
      <svg viewBox={wide ? '0 0 1200 300' : '0 0 390 300'} preserveAspectRatio="xMidYMax slice" aria-hidden>
        {art}
      </svg>
      <div className="scene-body">{children ?? null}</div>
    </div>
  )
}
