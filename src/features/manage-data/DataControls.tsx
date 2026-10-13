import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../../shared/ui/Button'
import { Icon } from '../../shared/ui/Icon'

interface DataControlsProps {
  onExport: () => void
  onImport: (file: File) => Promise<void>
}

export function DataControls({ onExport, onImport }: DataControlsProps) {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [imported, setImported] = useState(false)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      setError(null)
      await onImport(file)
      setImported(true)
      setTimeout(() => setImported(false), 2500)
    } catch {
      setError(t('data.import_error'))
    }
  }

  return (
    <div className="card">
      <p className="card-title">{t('data.title')}</p>
      <p className="card-meta" style={{ whiteSpace: 'normal' }}>
        {t('data.description')}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
        <Button type="button" variant="ghost" size="sm" onClick={onExport}>
          <Icon name="download" size={18} />
          {t('data.export')}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()}>
          <Icon name="upload" size={18} />
          {t('data.import')}
        </Button>
        <input ref={fileInputRef} type="file" accept="application/json" onChange={handleFileChange} hidden />
        {imported && <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--mint-deep)' }}>{t('data.restored')}</span>}
        {error && <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--danger)' }}>{error}</span>}
      </div>
    </div>
  )
}
