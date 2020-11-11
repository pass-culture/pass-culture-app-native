import { AllowedDeeplinkRoutes, DEEPLINK_TO_SCREEN_CONFIGURATION } from './types'

export const isAllowedRouteTypeGuard = (routeName: string): routeName is AllowedDeeplinkRoutes => {
  return typeof routeName === 'string' && routeName in DEEPLINK_TO_SCREEN_CONFIGURATION
}
