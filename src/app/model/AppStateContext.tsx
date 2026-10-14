import type { ReactNode } from 'react'
import { AppStateContext, useAppWithUI } from './appContext'

/** Wraps the router so every route (and the root layout's persistent chrome —
 *  nav, times-up alarm, mission-complete overlay) can share one live app state
 *  without prop-drilling it down through each route's own props. */
export function AppStateProvider({ children }: { children: ReactNode }) {
  const value = useAppWithUI()
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}
