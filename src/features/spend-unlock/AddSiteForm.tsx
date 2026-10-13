import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../../shared/ui/Button'

interface AddSiteFormProps {
  onAdd: (name: string, ratePer5Min: number) => void
}

export function AddSiteForm({ onAdd }: AddSiteFormProps) {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [rate, setRate] = useState(3)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onAdd(trimmed, Math.max(1, rate))
    setName('')
    setRate(3)
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end', gap: 12 }}>
      <label style={{ flex: 1, minWidth: 160, fontSize: 12, fontWeight: 700, color: 'var(--ink-muted)' }}>
        {t('unlocks.site_name_label')}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('unlocks.site_placeholder')}
          style={{ display: 'block', marginTop: 4, width: '100%', borderRadius: 999, border: '1.5px solid var(--line)', padding: '8px 14px', fontSize: 14, color: 'var(--ink)' }}
        />
      </label>
      <label style={{ width: 140, fontSize: 12, fontWeight: 700, color: 'var(--ink-muted)' }}>
        {t('unlocks.coins_per_5min')}
        <input
          type="number"
          min={1}
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          style={{ display: 'block', marginTop: 4, width: '100%', borderRadius: 999, border: '1.5px solid var(--line)', padding: '8px 14px', fontSize: 14, color: 'var(--ink)' }}
        />
      </label>
      <Button type="submit" size="sm">
        {t('unlocks.add_site')}
      </Button>
    </form>
  )
}
