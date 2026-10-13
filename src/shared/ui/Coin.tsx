export function Coin({ size = 26 }: { size?: number }) {
  return (
    <svg className="coin" viewBox="0 0 32 32" width={size} height={size} aria-hidden>
      <circle className="c-body" cx={16} cy={16} r={14} strokeWidth={2.5} />
      <circle className="c-ring" cx={16} cy={16} r={8.5} strokeWidth={2} />
      <ellipse className="c-shine" cx={11} cy={10} rx={2.8} ry={1.8} transform="rotate(-35 11 10)" />
    </svg>
  )
}
