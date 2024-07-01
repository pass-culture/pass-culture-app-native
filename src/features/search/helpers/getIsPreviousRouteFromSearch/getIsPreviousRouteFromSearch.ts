import { NavigatorScreenParams, ParamListBase, RouteProp } from '@react-navigation/native'

import { navigationRef } from 'features/navigation/navigationRef'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { TabParamList } from 'features/navigation/TabBar/types'
import { getRouteFromIndex } from 'shared/getRouteFromIndex/getRouteFromIndex'

export function getIsPreviousRouteFromSearch(
  route: keyof RootStackParamList,
  routes: RouteProp<ParamListBase>[] = navigationRef.getState().routes
) {
  const previousRoute = getRouteFromIndex(routes, 2)

  // Verify current route is search and previous route is venue
  const currentRoute = getRouteFromIndex(routes, 1)
  const currentRouteParams = currentRoute?.params as unknown as NavigatorScreenParams<TabParamList>

  const isSearchCurrentPage =
    currentRoute?.name === 'TabNavigator' && currentRouteParams?.screen === 'SearchStackNavigator'
  const isVenuePreviousPage = previousRoute?.name === route

  if (isSearchCurrentPage && isVenuePreviousPage) {
    return true
  }

  return false
}
