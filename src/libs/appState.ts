import { useRef, useEffect, DependencyList } from 'react'
import { AppState, AppStateStatus } from 'react-native'

export const useAppStateChange = (
  onAppBecomeActive: (() => void | Promise<void>) | undefined,
  onAppBecomeInactive: (() => void | Promise<void>) | undefined,
  deps: DependencyList | undefined = []
) => {
  const appState = useRef(AppState.currentState)

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    const becomesActive = appState.current.match(/inactive|background/) && nextAppState === 'active'
    const becomesInactive =
      appState.current === 'active' && nextAppState.match(/inactive|background/)

    if (becomesActive) onAppBecomeActive?.()
    else if (becomesInactive) onAppBecomeInactive?.()

    appState.current = nextAppState
  }

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange)
    return () => {
      subscription.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return appState
}
