import { NavigationState } from '@react-navigation/native'

import { NavigationResultState, RootNavigateParams } from 'features/navigation/RootNavigator/types'

export function getNestedNavigationFromState(
  state: NavigationResultState | NavigationState
): RootNavigateParams {
  if (!state || !state.routes) {
    return ['PageNotFound', undefined]
  }
  const { routes, index } = state
  const currentRouteIndex = index ?? routes.length - 1
  const route = routes[currentRouteIndex]
  if (route.state) {
    return getNestedNavigationFromState(route.state)
  }
  return [route.name, route.params] as RootNavigateParams
}
