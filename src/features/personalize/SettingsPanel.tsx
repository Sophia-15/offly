import { useTranslation } from 'react-i18next'
import type { Theme } from '../../app/model/types'
import { SUPPORTED_LANGUAGES } from '../../shared/i18n/config'
import { Segmented } from '../../shared/ui/Segmented'
import { Select } from '../../shared/ui/Select'

interface SettingsPanelProps {
  displayName: string
  onChangeDisplayName: (name: string) => void
  theme: Theme
  onChangeTheme: (theme: Theme) => void
  language: string
  onChangeLanguage: (language: string) => void
}

const THEME_OPTIONS: Theme[] = ['system', 'light', 'dark']

export function SettingsPanel({ displayName, onChangeDisplayName, theme, onChangeTheme, language, onChangeLanguage }: SettingsPanelProps) {
  const { t } = useTranslation()

  return (
    <div className="card">
      <p className="card-title">{t('me.settings_title')}</p>
      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-muted)' }}>
        {t('me.your_name')}
        <input
          type="text"
          value={displayName}
          onChange={(e) => onChangeDisplayName(e.target.value)}
          placeholder={t('me.name_placeholder')}
          style={{
            display: 'block',
            marginTop: 4,
            width: '100%',
            borderRadius: 999,
            border: '1.5px solid var(--line)',
            padding: '8px 14px',
            fontSize: 14,
            color: 'var(--ink)',
            boxSizing: 'border-box',
          }}
        />
      </label>
      <div>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-muted)' }}>{t('me.theme_label')}</span>
        <div style={{ marginTop: 6 }}>
          <Segmented
            ariaLabel={t('me.theme_label')}
            value={theme}
            onChange={(v) => onChangeTheme(v as Theme)}
            options={THEME_OPTIONS.map((opt) => ({ value: opt, label: t(`me.theme_${opt}`) }))}
          />
        </div>
      </div>
      <div>
        <span id="language-label" style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-muted)' }}>
          {t('me.language_label')}
        </span>
        <div style={{ marginTop: 4 }}>
          <Select
            inputId="language-select"
            ariaLabel={t('me.language_label')}
            value={language}
            onChange={onChangeLanguage}
            options={SUPPORTED_LANGUAGES.map((lang) => ({ value: lang.code, label: lang.label }))}
          />
        </div>
      </div>
    </div>
  )
}
