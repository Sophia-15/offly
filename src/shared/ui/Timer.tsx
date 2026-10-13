import { formatMinutesSeconds } from '../lib/time'

interface TimerProps {
  secondsLeft: number
  totalSeconds: number
  size?: number
  label?: string
  tone?: 'blue' | 'sun' | 'tangerine'
}

export function Timer({ secondsLeft, totalSeconds, size = 180, label, tone }: TimerProps) {
  const stroke = Math.max(8, size / 14)
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const fraction = totalSeconds > 0 ? Math.min(1, Math.max(0, secondsLeft / totalSeconds)) : 0
  const offset = circumference * (1 - fraction)

  return (
    <div
      className={tone ? `timer-${tone}` : undefined}
      style={{ position: 'relative', display: 'inline-grid', placeItems: 'center', width: size, height: size }}
    >
      <svg width={size} height={size} className="timer-ring" style={{ transform: 'rotate(-90deg)' }}>
        <circle className="timer-track" cx={size / 2} cy={size / 2} r={radius} strokeWidth={stroke} />
        <circle
          className="timer-progress"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <span className="timer-time" style={{ fontSize: size / 5 }}>
          {formatMinutesSeconds(secondsLeft)}
        </span>
        {label && <span className="timer-label">{label}</span>}
      </div>
    </div>
  )
}
