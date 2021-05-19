import { DEEPLINK_TO_SCREEN_CONFIGURATION } from './routing'
import { AllowedDeeplinkRoutes, ScreenConfiguration } from './types'

export const isAllowedRouteTypeGuard = (routeName: string): routeName is AllowedDeeplinkRoutes => {
  return typeof routeName === 'string' && routeName in DEEPLINK_TO_SCREEN_CONFIGURATION
}

export const isIdCheckScreenConfig = (
  screenConfig: ScreenConfiguration<any>
): screenConfig is ScreenConfiguration<'IdCheck'> => {
  return screenConfig.screen === 'IdCheck'
}
