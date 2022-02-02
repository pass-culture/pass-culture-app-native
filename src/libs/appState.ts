import { useRef, useEffect, DependencyList } from 'react'
import { AppState, AppStateStatus } from 'react-native'

export const useAppStateChange = (
  onAppBecomeActive: (() => void | Promise<void>) | undefined,
  onAppBecomeInactive: (() => void | Promise<void>) | undefined,
  deps: DependencyList | undefined = []
) => {
  const appState = useRef(AppState.currentState)

  function handleAppStateChange(nextAppState: AppStateStatus) {
    if (onAppBecomeInactive && isActive(appState.current) && isInactiveOrBackground(nextAppState)) {
      onAppBecomeInactive()
    }
    if (onAppBecomeActive && isInactiveOrBackground(appState.current) && isActive(nextAppState)) {
      onAppBecomeActive()
    }
    appState.current = nextAppState
  }

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange)
    return () => {
      subscription.remove()
    }
  }, deps)
  return appState
}

function isActive(stateStatus: AppStateStatus) {
  return stateStatus === 'active'
}

function isInactiveOrBackground(stateStatus: AppStateStatus) {
  return stateStatus === 'inactive' || stateStatus === 'background'
}
