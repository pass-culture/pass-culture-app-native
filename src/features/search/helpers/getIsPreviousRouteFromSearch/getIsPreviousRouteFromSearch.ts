import { NavigatorScreenParams } from '@react-navigation/native'

import { navigationRef } from 'features/navigation/navigationRef'
import { AllNavParamList } from 'features/navigation/RootNavigator/types'
import { TabParamList } from 'features/navigation/TabBar/types'
import { getRouteFromIndex } from 'shared/getRouteFromIndex/getRouteFromIndex'

export function getIsPreviousRouteFromSearch(
  route: keyof AllNavParamList,
  routes = navigationRef.getState().routes
) {
  const previousRoute =
    getRouteFromIndex(routes, 2) || getPreviousRouteFromSearchStack(route, routes)
  const currentRoute = getRouteFromIndex(routes, 1)
  const currentRouteParams = currentRoute?.params as unknown as NavigatorScreenParams<TabParamList>

  const isSearchCurrentPage =
    currentRoute?.name === 'TabNavigator' && currentRouteParams?.screen === 'SearchStackNavigator'

  return isSearchCurrentPage && previousRoute?.name === route
}

// react-navigation doesn't expose this type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getPreviousRouteFromSearchStack = (route: keyof AllNavParamList, routes: any) => {
  return routes[0]?.state?.routes
    .find((currentRoute: { name: string }) => currentRoute.name === 'SearchStackNavigator')
    .state.routes.find((currentRoute: { name: string }) => {
      return currentRoute.name === route
    })
}
