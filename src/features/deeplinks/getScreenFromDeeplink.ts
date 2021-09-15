import { linking } from 'features/navigation/RootNavigator/linking'
import { WEBAPP_V2_URL } from 'libs/environment'

import { DeeplinkParts } from './types'
import { WEBAPP_NATIVE_REDIRECTION_URL } from './utils'

export function getScreenFromDeeplink(url: string): DeeplinkParts {
  // We have to try 2 replaces since we support both pre and post-decliweb versions
  const pathWithQueryString = url
    .replace(`${WEBAPP_NATIVE_REDIRECTION_URL}/`, '')
    .replace(`${WEBAPP_V2_URL}/`, '')
  const navigationState = linking.getStateFromPath(pathWithQueryString, linking.config)
  const route = getLastRouteFromState(navigationState)
  const screen = route.name
  let params = route.params
  if (screen === 'TabNavigator') {
    const nestedRoute = getLastRouteFromState(route.state)
    params = {
      screen: nestedRoute.name,
      params: nestedRoute.params,
    }
  }
  return { screen, params } as DeeplinkParts
}

type NavigationState = ReturnType<typeof linking.getStateFromPath>

function getLastRouteFromState(navigationState: NavigationState) {
  const routes = navigationState?.routes
  if (!routes || routes.length === 0) {
    throw new Error('Unknown route')
  }
  return routes[routes.length - 1]
}
