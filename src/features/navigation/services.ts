import { NavigationState } from '@react-navigation/native'

import { analytics } from 'libs/analytics'

type NavigationRouteType = Exclude<NavigationState['routes'][0]['state'], undefined>
export function onNavigationStateChange(state: NavigationState | undefined): void {
  if (!state || !state.routes) {
    return
  }
  const screenName = getScreenName(state)
  analytics.logScreenView({ screen_name: screenName })
}

export const getScreenName = (state: NavigationRouteType): string => {
  const route = state.routes[state.index ?? 0]
  if (route?.state === undefined) return route.name
  return getScreenName(route.state)
}
