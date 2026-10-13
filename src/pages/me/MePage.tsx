import { useTranslation } from 'react-i18next'
import { findBuddy } from '../../entities/buddy/model'
import { BuddyAvatar } from '../../entities/buddy/BuddyAvatar'
import { BuddyPicker } from '../../features/pick-buddy/BuddyPicker'
import { DataControls } from '../../features/manage-data/DataControls'
import { SettingsPanel } from '../../features/personalize/SettingsPanel'
import type { Theme } from '../../app/model/types'
import { Bubble } from '../../shared/ui/Bubble'
import { Scene } from '../../shared/ui/Scene'
import { StatsGrid } from '../../widgets/stats-grid/StatsGrid'

interface MePageProps {
  buddyId: string
  onPickBuddy: (buddyId: string) => void
  displayName: string
  onChangeDisplayName: (name: string) => void
  theme: Theme
  onChangeTheme: (theme: Theme) => void
  language: string
  onChangeLanguage: (language: string) => void
  totalPoints: number
  longestStreak: number
  totalCompletions: number
  totalSpent: number
  onExport: () => void
  onImport: (file: File) => Promise<void>
}

export function MePage({
  buddyId,
  onPickBuddy,
  displayName,
  onChangeDisplayName,
  theme,
  onChangeTheme,
  language,
  onChangeLanguage,
  totalPoints,
  longestStreak,
  totalCompletions,
  totalSpent,
  onExport,
  onImport,
}: MePageProps) {
  const { t } = useTranslation()
  const buddy = findBuddy(buddyId)

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '16px 24px 56px', boxSizing: 'border-box' }}>
      <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 36 }}>{t('me.title')}</h1>
      <p style={{ margin: '8px 0 0', fontSize: 16, fontWeight: 600, color: 'var(--ink-muted)' }}>{t('me.subtitle')}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginTop: 24, alignItems: 'flex-start' }}>
        <section style={{ flex: '1 1 320px', minWidth: 0 }} aria-label="Preview">
          <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative' }}>
            <Scene height={360} />
            <div style={{ position: 'absolute', left: 0, right: 0, top: 32, display: 'flex', justifyContent: 'center', padding: '0 20px' }}>
              <Bubble>{t(buddy.lineKey)}</Bubble>
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 56, display: 'flex', justifyContent: 'center' }}>
              <BuddyAvatar buddy={buddy} size={140} />
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 16, display: 'flex', justifyContent: 'center' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  height: 34,
                  padding: '0 16px',
                  borderRadius: 999,
                  background: 'var(--surface-raised)',
                  fontSize: 15,
                  fontWeight: 800,
                  color: 'var(--ink)',
                  boxShadow: 'var(--shadow-edge)',
                }}
              >
                {buddy.name} · {t(buddy.roleKey)}
              </span>
            </div>
          </div>
        </section>
        <section style={{ flex: '999 1 480px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{t('me.your_buddy')}</h2>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-muted)' }}>{t('me.change_anytime')}</span>
          </div>
          <BuddyPicker selectedId={buddyId} onPick={onPickBuddy} />

          <h2 style={{ margin: '8px 0 0', fontSize: 18, fontWeight: 800 }}>{t('me.your_stats')}</h2>
          <StatsGrid
            stats={[
              { value: totalPoints, label: t('me.stat_coins_earned') },
              { value: t('me.day', { count: longestStreak }), label: t('me.stat_best_streak') },
              { value: totalCompletions, label: t('me.stat_missions_done') },
              { value: totalSpent, label: t('me.stat_coins_spent') },
            ]}
          />

          <SettingsPanel
            displayName={displayName}
            onChangeDisplayName={onChangeDisplayName}
            theme={theme}
            onChangeTheme={onChangeTheme}
            language={language}
            onChangeLanguage={onChangeLanguage}
          />

          <DataControls onExport={onExport} onImport={onImport} />
        </section>
      </div>
    </main>
  )
}
