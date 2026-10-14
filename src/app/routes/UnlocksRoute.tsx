import { UnlocksPage } from '../../pages/unlocks/UnlocksPage'
import { useApp } from '../model/useApp'

export function UnlocksRoute() {
  const { state, openUnlocks, balance, unlockSite, addCustomSite, removeSite } = useApp()

  return (
    <UnlocksPage
      sites={state.sites}
      openUnlocks={openUnlocks}
      balance={balance}
      onUnlock={unlockSite}
      onAddSite={addCustomSite}
      onRemoveSite={removeSite}
    />
  )
}
