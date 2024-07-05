import { NavigatorScreenParams, ParamListBase, RouteProp } from '@react-navigation/native'

import { navigationRef } from 'features/navigation/navigationRef'
import { AllNavParamList } from 'features/navigation/RootNavigator/types'
import { TabParamList } from 'features/navigation/TabBar/types'
import { getRouteFromIndex } from 'shared/getRouteFromIndex/getRouteFromIndex'

export function getIsPreviousRouteFromSearch(
  route: keyof AllNavParamList,
  routes: RouteProp<ParamListBase>[] = navigationRef.getState().routes
) {
  const previousRoute = getRouteFromIndex(routes, 2)
  const currentRoute = getRouteFromIndex(routes, 1)
  const currentRouteParams = currentRoute?.params as unknown as NavigatorScreenParams<TabParamList>

  console.log({ previousRoute, currentRoute })
  const isSearchCurrentPage =
    currentRoute?.name === 'TabNavigator' && currentRouteParams?.screen === 'SearchStackNavigator'
  const isVenuePreviousPage = previousRoute?.name === route

  if (isSearchCurrentPage && isVenuePreviousPage) {
    return true
  }

  return false
}
