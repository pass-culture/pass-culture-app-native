import { linking } from 'features/navigation/RootNavigator/linking'
import { NavigationResultState } from 'features/navigation/RootNavigator/types'

import { DeeplinkParts } from '../types'

export function getScreenFromDeeplink(url: string): DeeplinkParts {
  let pathWithQueryString = url
  for (const prefix of linking.prefixes) {
    pathWithQueryString = pathWithQueryString.replace(prefix, '')
  }
  const navigationState = linking.getStateFromPath(pathWithQueryString, linking.config)
  const route = getLastRouteFromState(navigationState)
  const screen = route.name
  let params = route.params
  if (route.state) {
    const nestedRoute = getLastRouteFromState(route.state)
    params = {
      screen: nestedRoute.name,
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
