import { useContext } from 'react'
import { AppStateContext, type AppContextValue } from './appContext'

export function useApp(): AppContextValue {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useApp must be used within <AppStateProvider>')
  return ctx
}
