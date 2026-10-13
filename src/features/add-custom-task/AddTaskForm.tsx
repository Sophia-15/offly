import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../../shared/ui/Button'
import { EmojiPicker } from '../../shared/ui/EmojiPicker'

interface AddTaskFormProps {
  onAdd: (name: string, points: number, emoji: string) => void
}

const EMOJI_CHOICES = ['⭐', '🌱', '🎯', '🧩', '🍀', '🎨', '🧠', '🌻']

export function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [points, setPoints] = useState(10)
  const [emoji, setEmoji] = useState(EMOJI_CHOICES[0])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onAdd(trimmed, Math.max(1, points), emoji)
    setName('')
    setPoints(10)
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end', gap: 12 }}>
      <EmojiPicker choices={EMOJI_CHOICES} value={emoji} onChange={setEmoji} ariaLabel={t('missions.choose_emoji')} />
      <label style={{ flex: 1, minWidth: 160, fontSize: 12, fontWeight: 700, color: 'var(--ink-muted)' }}>
        {t('missions.new_mission_label')}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('missions.new_mission_placeholder')}
          style={{ display: 'block', marginTop: 4, width: '100%', borderRadius: 999, border: '1.5px solid var(--line)', padding: '8px 14px', fontSize: 14, color: 'var(--ink)' }}
        />
      </label>
      <label style={{ width: 96, fontSize: 12, fontWeight: 700, color: 'var(--ink-muted)' }}>
        {t('missions.coins_label')}
        <input
          type="number"
          min={1}
          value={points}
          onChange={(e) => setPoints(Number(e.target.value))}
          style={{ display: 'block', marginTop: 4, width: '100%', borderRadius: 999, border: '1.5px solid var(--line)', padding: '8px 14px', fontSize: 14, color: 'var(--ink)' }}
        />
      </label>
      <Button type="submit" size="sm">
        {t('missions.add_mission')}
      </Button>
    </form>
  )
}
