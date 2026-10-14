import { useMemo } from 'react'
import { MePage } from '../../pages/me/MePage'
import { useApp } from '../model/useApp'

export function MeRoute() {
  const {
    state,
    balance,
    streak,
    pickBuddy,
    setDisplayName,
    setTheme,
    setLanguage,
    setAlarmStyle,
    setNotifyEnabled,
    exportState,
    importState,
  } = useApp()

  const totalSpent = useMemo(() => state.unlocks.reduce((sum, u) => sum + u.cost, 0), [state.unlocks])

  return (
    <MePage
      buddyId={state.buddyId}
      onPickBuddy={pickBuddy}
      displayName={state.displayName}
      onChangeDisplayName={setDisplayName}
      theme={state.theme}
      onChangeTheme={setTheme}
      language={state.language}
      onChangeLanguage={setLanguage}
      alarmStyle={state.alarmStyle}
      onChangeAlarmStyle={setAlarmStyle}
      notifyEnabled={state.notifyEnabled}
      onChangeNotifyEnabled={setNotifyEnabled}
      balance={balance}
      totalPoints={streak.totalPoints}
      longestStreak={streak.longest}
      totalCompletions={streak.totalCompletions}
      totalSpent={totalSpent}
      onExport={exportState}
      onImport={importState}
    />
  )
}
