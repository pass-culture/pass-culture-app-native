import { useRef, useEffect, DependencyList } from 'react'
import { AppState, AppStateStatus } from 'react-native'

export const useAppStateChange = (
  onAppBecomeActive: () => void,
  onAppBecomeInactive: () => void,
  deps: DependencyList | undefined = []
) => {
  const appState = useRef(AppState.currentState)

  function handleAppStateChange(nextAppState: AppStateStatus) {
    if (isActive(appState.current) && isInactiveOrBackground(nextAppState)) {
      onAppBecomeInactive()
    }
    if (isInactiveOrBackground(appState.current) && isActive(nextAppState)) {
      onAppBecomeActive()
    }
    appState.current = nextAppState
  }

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange)
    return () => {
      AppState.removeEventListener('change', handleAppStateChange)
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
