import { linking } from 'features/navigation/RootNavigator/linking'
import { linkingPrefixes } from 'features/navigation/RootNavigator/linking/linkingPrefixes'
import { NavigationResultState } from 'features/navigation/RootNavigator/types'

import { DeeplinkParts } from '../types'

export function getScreenFromDeeplink(url: string): DeeplinkParts {
  let pathWithQueryString = url
  for (const prefix of linkingPrefixes) {
    pathWithQueryString = pathWithQueryString.replace(prefix, '')
  }
  const navigationState = linking.getStateFromPath(pathWithQueryString, linking.config)
  const route = getLastRouteFromState(navigationState)
  // @ts-expect-error: because of noUncheckedIndexedAccess
  const screen = route.name
  // @ts-expect-error: because of noUncheckedIndexedAccess
  let params = route.params
  // @ts-expect-error: because of noUncheckedIndexedAccess
  if (route.state) {
    // @ts-expect-error: because of noUncheckedIndexedAccess
    const nestedRoute = getLastRouteFromState(route.state)
    params = {
      // @ts-expect-error: because of noUncheckedIndexedAccess
      screen: nestedRoute.name,
      // @ts-expect-error: because of noUncheckedIndexedAccess
      params: nestedRoute.params,
    }
  }
  return { screen, params } as DeeplinkParts
}

function getLastRouteFromState(navigationState: NavigationResultState) {
  const routes = navigationState?.routes
  if (!routes || routes.length === 0) {
    throw new Error('Unknown route')
  }
  return routes[routes.length - 1]
}
