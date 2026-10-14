import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { AlarmStyle, Theme } from '../../app/model/types'
import { SUPPORTED_LANGUAGES } from '../../shared/i18n/config'
import { notificationPermission, notificationsSupported, requestNotifyPermission } from '../../shared/lib/alarmNotify'
import { primeAudio } from '../../shared/lib/chime'
import { Button } from '../../shared/ui/Button'
import { Icon } from '../../shared/ui/Icon'
import { Segmented } from '../../shared/ui/Segmented'
import { Select } from '../../shared/ui/Select'

interface SettingsPanelProps {
  displayName: string
  onChangeDisplayName: (name: string) => void
  theme: Theme
  onChangeTheme: (theme: Theme) => void
  language: string
  onChangeLanguage: (language: string) => void
  alarmStyle: AlarmStyle
  onChangeAlarmStyle: (style: AlarmStyle) => void
  notifyEnabled: boolean
  onChangeNotifyEnabled: (enabled: boolean) => void
}

const THEME_OPTIONS: Theme[] = ['system', 'light', 'dark']
const ALARM_STYLE_OPTIONS: AlarmStyle[] = ['gentle', 'persistent', 'relentless']

export function SettingsPanel({
  displayName,
  onChangeDisplayName,
  theme,
  onChangeTheme,
  language,
  onChangeLanguage,
  alarmStyle,
  onChangeAlarmStyle,
  notifyEnabled,
  onChangeNotifyEnabled,
}: SettingsPanelProps) {
  const { t } = useTranslation()
  const [permission, setPermission] = useState(() => notificationPermission())

  async function handleEnableNotify() {
    primeAudio()
    const result = await requestNotifyPermission()
    setPermission(result)
    onChangeNotifyEnabled(result === 'granted')
  }

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
      <div>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-muted)' }}>{t('me.alarm_style_label')}</span>
        <div style={{ marginTop: 6 }}>
          <Segmented
            ariaLabel={t('me.alarm_style_label')}
            value={alarmStyle}
            onChange={(v) => onChangeAlarmStyle(v as AlarmStyle)}
            options={ALARM_STYLE_OPTIONS.map((opt) => ({ value: opt, label: t(`me.alarm_style_${opt}`) }))}
          />
        </div>
        <p style={{ margin: '6px 0 0', fontSize: 13, fontWeight: 600, color: 'var(--ink-muted)' }}>{t('me.alarm_style_hint')}</p>
      </div>
      <div>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-muted)' }}>{t('me.notify_label')}</span>
        <p style={{ margin: '4px 0 10px', fontSize: 13, fontWeight: 600, color: 'var(--ink-muted)' }}>{t('me.notify_hint')}</p>
        {notificationsSupported() ? (
          <Button type="button" variant={notifyEnabled && permission === 'granted' ? 'mint' : 'ghost'} onClick={handleEnableNotify} disabled={permission === 'denied'}>
            <Icon name="bell" size={18} />
            {permission === 'denied'
              ? t('me.notify_blocked_status')
              : notifyEnabled && permission === 'granted'
                ? t('me.notify_enabled_status')
                : t('me.notify_enable_button')}
          </Button>
        ) : (
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--ink-muted)' }}>{t('me.notify_unsupported')}</p>
        )}
      </div>
    </div>
  )
}
