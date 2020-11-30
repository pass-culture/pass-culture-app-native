import { NavigationState } from '@react-navigation/native'

import { analytics } from 'libs/analytics'

export function onNavigationStateChange(state: NavigationState | undefined): void {
  if (!state || !state.routes) {
    return
  }

  const { routes } = state

  const currentRoute = routes.length > 0 ? routes[routes.length - 1] : undefined

  if (currentRoute) {
    analytics.logScreenView({ screen_name: currentRoute.name })
  }
}

export const getScreenName = (state: NavigationState): string => {
  return 'tmp'
}
