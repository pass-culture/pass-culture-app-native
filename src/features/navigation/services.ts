import { NavigationState } from '@react-navigation/native'
import { Platform } from 'react-native'

import { getNestedNavigationFromState } from 'features/navigation/RootNavigator/linking/getNestedNavigationFromState'
import { sanitizeNavigationState } from 'features/navigation/sanitizeNavigationState'
import { analytics } from 'libs/analytics'
import { storage } from 'libs/storage'

export function onNavigationStateChange(state?: NavigationState): void {
  if (!state || !state.routes) {
    return
  }
  if (Platform.OS === 'web') {
    storage.saveObject('react_navigation_persistence', sanitizeNavigationState(state))
    if (globalThis.window.pcupdate) {
      globalThis.window.location.reload()
    }
  }
  const [screen] = getNestedNavigationFromState(state)
  analytics.logScreenView(screen)
}
