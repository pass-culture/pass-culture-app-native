import { NavigationState } from '@react-navigation/native'
import { Platform } from 'react-native'

import { getNestedNavigationFromState } from 'features/navigation/RootNavigator/linking/getNestedNavigationFromState'
import { analytics } from 'libs/analytics'
import { storage } from 'libs/storage'
import { ServiceWorkerStatus } from 'web/useServiceWorker'

type Options = {
  serviceWorkerStatus?: ServiceWorkerStatus
}

export function onNavigationStateChange(
  state: NavigationState,
  { serviceWorkerStatus }: Options = {}
): void {
  if (!state || !state.routes) {
    return
  }
  if (Platform.OS === 'web') {
    storage.saveObject('react_navigation_persistence', state)
    if (serviceWorkerStatus === 'updated') {
      globalThis?.window?.location?.reload()
    }
  }
  const [screen] = getNestedNavigationFromState(state)
  analytics.logScreenView(screen)
}
