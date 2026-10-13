interface Stat {
  value: string | number
  label: string
}

export function StatsGrid({ stats }: { stats: Stat[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
      {stats.map((stat) => (
        <div key={stat.label} className="card" style={{ gap: 2 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 28, lineHeight: '34px' }}>{stat.value}</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-muted)' }}>{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
