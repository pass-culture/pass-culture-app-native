import { NavigationState } from '@react-navigation/native'

import { getNestedNavigationFromState } from 'features/navigation/RootNavigator/linking/getNestedNavigationFromState'
import { analytics } from 'libs/analytics'

export function onNavigationStateChange(state: NavigationState): void {
  if (!state || !state.routes) {
    return
  }
  const [screen] = getNestedNavigationFromState(state)
  analytics.logScreenView(screen)
}
