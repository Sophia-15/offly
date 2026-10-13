import type { CSSProperties } from 'react'

// A one-shot (or looping) burst of coins, leaves and stars, used when a
// mission is completed or a reward is earned.
const BURST: [string, number, number, number][] = [
  ['coin', -120, -150, 200], ['leaf', -40, -190, -160], ['star', 60, -180, 120], ['coin', 130, -130, -220], ['leaf', 160, -40, 260],
  ['star', 140, 60, -90], ['coin', 70, 120, 180], ['leaf', -30, 140, -240], ['star', -110, 100, 140], ['coin', -170, 20, -200],
  ['star', -150, -70, 90], ['leaf', 20, -120, 200], ['coin', -60, -90, 160], ['star', 100, -70, -140], ['coin', 30, 70, 220],
  ['leaf', -90, 40, -120], ['star', 0, -210, 60], ['coin', 180, -90, 140],
]

const BURST_COLORS: Record<string, string[]> = {
  star: ['var(--sun)', 'var(--blush)', '#7fb6ff'],
  leaf: ['#7dd56f', '#a6e08a', '#5cc46a'],
}

interface CelebrationProps {
  loop?: boolean
  spread?: number
  style?: CSSProperties
}

export function Celebration({ loop = true, spread = 1, style }: CelebrationProps) {
  return (
    <div className={`celebrate ${loop ? 'celebrate-loop' : ''}`} aria-hidden style={style}>
      <span className="celebrate-ring" />
      <span className="celebrate-ring celebrate-ring-2" />
      {BURST.map(([kind, dx, dy, r], i) => {
        const color = kind === 'coin' ? undefined : BURST_COLORS[kind][i % 3]
        const bitStyle = {
          '--dx': `${Math.round(dx * spread)}px`,
          '--dy': `${Math.round(dy * spread)}px`,
          '--r': `${r}deg`,
          animationDelay: `${(i % 4) * 0.04}s`,
          ...(color ? { background: color } : {}),
        } as CSSProperties
        return <span key={i} className={`celebrate-bit celebrate-bit-${kind}`} style={bitStyle} />
      })}
    </div>
  )
}
