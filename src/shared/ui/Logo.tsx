// An original wordmark (hand-drawn rounded strokes, no font needed) whose O is
// Pip, the sun, plus an app-icon variant: the sun rising over a hill.

function logoSunParts(cx0: number, cy0: number, r: number, withRays: boolean) {
  const parts = []
  if (withRays) {
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4 + Math.PI / 8
      const c = Math.cos(a)
      const sn = Math.sin(a)
      parts.push(
        <line
          key={`r${i}`}
          x1={cx0 + c * (r + 6)}
          y1={cy0 + sn * (r + 6)}
          x2={cx0 + c * (r + 14)}
          y2={cy0 + sn * (r + 14)}
          stroke="#e3a700"
          strokeWidth={7}
          strokeLinecap="round"
        />,
      )
    }
  }
  parts.push(<circle key="b" cx={cx0} cy={cy0} r={r} fill="#ffd23f" stroke="#e3a700" strokeWidth={4} />)
  parts.push(<ellipse key="k1" cx={cx0 - r * 0.55} cy={cy0 + r * 0.22} rx={r * 0.17} ry={r * 0.1} fill="#ff9db5" />)
  parts.push(<ellipse key="k2" cx={cx0 + r * 0.55} cy={cy0 + r * 0.22} rx={r * 0.17} ry={r * 0.1} fill="#ff9db5" />)
  parts.push(<circle key="e1" cx={cx0 - r * 0.3} cy={cy0 - r * 0.12} r={r * 0.13} fill="#1d2b5c" />)
  parts.push(<circle key="e2" cx={cx0 + r * 0.3} cy={cy0 - r * 0.12} r={r * 0.13} fill="#1d2b5c" />)
  parts.push(
    <path
      key="m"
      d={`M${cx0 - r * 0.24} ${cy0 + r * 0.24}Q${cx0} ${cy0 + r * 0.46} ${cx0 + r * 0.24} ${cy0 + r * 0.24}`}
      fill="none"
      stroke="#1d2b5c"
      strokeWidth={r * 0.1}
      strokeLinecap="round"
    />,
  )
  return parts
}

const WORD = [
  'M128 100V42Q128 18 152 18',
  'M168 100V42Q168 18 192 18',
  'M114 56H186',
  'M210 14V100',
  'M232 50V72Q232 92 250 92Q268 92 268 72',
  'M268 50V106Q268 126 247 126Q235 126 229 119',
]

interface LogoProps {
  variant?: 'wordmark' | 'icon'
  tone?: 'ink' | 'white' | 'navy'
  size?: number
  height?: number
  label?: string
}

export function Logo({ variant = 'wordmark', tone, size = 64, height = 48, label = 'Offly' }: LogoProps) {
  const ink = tone === 'white' ? '#ffffff' : tone === 'navy' ? '#14213d' : 'var(--scene-ink, var(--ink, #14213d))'

  if (variant === 'icon') {
    return (
      <svg className="logo" viewBox="0 0 120 120" width={size} height={size} role="img" aria-label={label}>
        <defs>
          <clipPath id="logo-clip">
            <rect width={120} height={120} rx={28} />
          </clipPath>
        </defs>
        <g clipPath="url(#logo-clip)">
          <rect width={120} height={120} fill="#0060f0" />
          <g fill="#ffffff" opacity={0.9}>
            <rect x={14} y={28} width={34} height={10} rx={5} />
            <circle cx={26} cy={27} r={7} />
            <circle cx={36} cy={25} r={8} />
          </g>
          {logoSunParts(62, 70, 24, true)}
          <path d="M0 92Q40 74 80 86T120 82V120H0Z" fill="#8fdc7a" />
          <path d="M0 104Q50 92 120 100V120H0Z" fill="#5cc46a" />
        </g>
      </svg>
    )
  }

  return (
    <svg className="logo" viewBox="-6 -6 290 140" height={height} width={(height * 290) / 140} role="img" aria-label={label}>
      {logoSunParts(52, 60, 34, true)}
      <g fill="none" style={{ stroke: ink }} strokeWidth={17} strokeLinecap="round" strokeLinejoin="round">
        {WORD.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  )
}
