import { isRootStackScreen } from 'features/navigation/navigators/RootNavigator/isRootStackScreen'
import { linking } from 'features/navigation/navigators/RootNavigator/linking/linking'
import { NavigationResultState } from 'features/navigation/navigators/RootNavigator/types'

import { DeeplinkParts } from '../types'

export const getScreenFromDeeplink = (url: string): DeeplinkParts => {
  let pathWithQueryString = url
  for (const prefix of linking.prefixes) {
    pathWithQueryString = pathWithQueryString.replace(prefix, '')
  }
  const navigationState = linking.getStateFromPath(pathWithQueryString, linking.config)
  const route = getLastRouteFromState(navigationState)
  const screen = route?.name
  let params = route?.params
  if (!screen || !isRootStackScreen(screen)) {
    throw new Error('Screen has unexpected value', { cause: { url, navigationState, route } })
  }
  if (route?.state) {
    const nestedRoute = getLastRouteFromState(route.state)
    params = {
      screen: nestedRoute?.name,
      params: nestedRoute?.params,
    }
  }
  return { screen, params }
}

const getLastRouteFromState = (navigationState: NavigationResultState) => {
  const routes = navigationState?.routes
  if (!routes || routes.length === 0) {
    throw new Error('Unknown route')
  }
  return routes[routes.length - 1]
}
