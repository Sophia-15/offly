import { useTranslation } from 'react-i18next'
import { Icon } from '../../shared/ui/Icon'
import type { WeekDay } from '../../shared/lib/streak'

interface WeekStreakProps {
  week: WeekDay[]
}

export function WeekStreak({ week }: WeekStreakProps) {
  const { t, i18n } = useTranslation()
  const doneCount = week.filter((d) => d.done).length
  const weekdayFormatter = new Intl.DateTimeFormat(i18n.language, { weekday: 'narrow' })

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <p className="card-title">{t('missions.this_week')}</p>
        <span className="card-meta">{t('missions.days_of_7', { count: doneCount })}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 6, marginTop: 10, textAlign: 'center' }}>
        {week.map((day, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: 999,
                display: 'grid',
                placeItems: 'center',
                boxShadow: day.isToday ? '0 0 0 3px var(--blue-soft)' : undefined,
                background: day.done ? 'var(--mint)' : 'var(--line)',
                color: 'var(--on-accent)',
              }}
            >
              {day.done && <Icon name="check" size={13} strokeWidth={3.5} />}
            </span>
            <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--ink-muted)' }}>{weekdayFormatter.format(new Date(day.date))}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
