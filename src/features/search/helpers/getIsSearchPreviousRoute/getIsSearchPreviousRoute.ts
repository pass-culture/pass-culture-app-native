import { NavigatorScreenParams, ParamListBase, RouteProp } from '@react-navigation/core'

import { TabParamList } from 'features/navigation/TabBar/types'
import { SearchView } from 'features/search/types'
import { getRouteFromIndex } from 'shared/getRouteFromIndex/getRouteFromIndex'

export function getIsSearchPreviousRoute(
  routes: RouteProp<ParamListBase>[],
  previousView?: SearchView
) {
  const previousRoute = getRouteFromIndex(routes, 2)

  // Verify current route is search with a different view to avoid bad redirection
  const currentRoute = getRouteFromIndex(routes, 1)
  const currentRouteParams = currentRoute?.params as unknown as NavigatorScreenParams<TabParamList>

  const isSearchCurrentPage =
    currentRoute?.name === 'TabNavigator' && currentRouteParams?.screen === 'Search'

  if (
    isSearchCurrentPage &&
    (currentRouteParams?.params?.view !== previousView ||
      (currentRouteParams?.params?.view === SearchView.Results &&
        previousView === SearchView.Results &&
        previousRoute?.name !== 'Venue'))
  ) {
    return true
  }

  return false
}
