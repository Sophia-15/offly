import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SiteCard } from '../../entities/site/SiteCard'
import { costFor, type Site } from '../../entities/site/model'
import { AddSiteForm } from '../../features/spend-unlock/AddSiteForm'
import { DurationPicker } from '../../features/spend-unlock/DurationPicker'
import { formatMinutesSeconds } from '../../shared/lib/time'
import { Mascot } from '../../shared/ui/Mascot'

interface OpenUnlock {
  id: string
  siteId: string
  siteName: string
  remainingSeconds: number
}

interface UnlocksPageProps {
  sites: Site[]
  openUnlocks: OpenUnlock[]
  balance: number
  onUnlock: (site: Site, minutes: number) => void
  onAddSite: (name: string, ratePer5Min: number) => void
  onRemoveSite: (siteId: string) => void
}

export function UnlocksPage({ sites, openUnlocks, balance, onUnlock, onAddSite, onRemoveSite }: UnlocksPageProps) {
  const { t } = useTranslation()
  const [minutes, setMinutes] = useState(15)
  const openSiteIds = new Set(openUnlocks.map((u) => u.siteId))
  const lockedSites = sites.filter((s) => !openSiteIds.has(s.id))

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '16px 24px 56px', boxSizing: 'border-box' }}>
      <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 36 }}>{t('unlocks.title')}</h1>
      <p style={{ margin: '8px 0 0', fontSize: 16, fontWeight: 600, color: 'var(--ink-muted)' }}>{t('unlocks.subtitle')}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginTop: 24, alignItems: 'flex-start' }}>
        <section style={{ flex: '999 1 480px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{t('unlocks.how_long')}</h2>
          <DurationPicker minutes={minutes} onPick={setMinutes} />

          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 8 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{t('unlocks.locked_sites')}</h2>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-muted)' }}>
              {t('unlocks.site_count', { count: lockedSites.length })}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {lockedSites.map((site) => {
              const cost = costFor(site, minutes)
              return (
                <SiteCard
                  key={site.id}
                  site={site}
                  state="locked"
                  minutes={minutes}
                  cost={cost}
                  disabled={cost > balance}
                  onUnlock={() => onUnlock(site, minutes)}
                />
              )
            })}
          </div>
          <AddSiteForm onAdd={onAddSite} />
          {sites.some((s) => s.isCustom) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {sites
                .filter((s) => s.isCustom)
                .map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className="nav-link"
                    onClick={() => onRemoveSite(s.id)}
                    style={{ fontSize: 12 }}
                  >
                    {t('unlocks.remove_site', { name: s.name })}
                  </button>
                ))}
            </div>
          )}
        </section>
        <aside style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{t('unlocks.open_now')}</h2>
          {openUnlocks.length === 0 ? (
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-muted)' }}>{t('unlocks.nothing_unlocked')}</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {openUnlocks.map((u) => {
                const site = sites.find((s) => s.id === u.siteId)
                if (!site) return null
                return <SiteCard key={u.id} site={site} state="open" remainingLabel={formatMinutesSeconds(u.remainingSeconds)} />
              })}
            </div>
          )}
          <div
            style={{
              marginTop: 8,
              padding: 18,
              borderRadius: 'var(--radius-md)',
              background: 'var(--sun-soft)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 10,
            }}
          >
            <Mascot character="cactus" mood="curious" size={96} />
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>{t('unlocks.need_more_coins_title')}</h2>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--ink-muted)' }}>{t('unlocks.need_more_coins_body')}</p>
          </div>
        </aside>
      </div>
    </main>
  )
}
