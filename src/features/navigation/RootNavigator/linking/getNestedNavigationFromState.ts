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
  // @ts-expect-error: because of noUncheckedIndexedAccess
  if (route.state) {
    // @ts-expect-error: because of noUncheckedIndexedAccess
    return getNestedNavigationFromState(route.state)
  }
  // @ts-expect-error: because of noUncheckedIndexedAccess
  return [route.name, route.params] as RootNavigateParams
}
