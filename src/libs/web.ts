import { t } from '@lingui/macro'
import { Platform } from 'react-native'

import { RedirectWebToNative } from 'features/navigation/RedirectWebToNative'
import { Route, ScreenNames } from 'features/navigation/RootNavigator'
import { TabRoute } from 'features/navigation/TabBar/types'
import { env } from 'libs/environment'

export const IS_WEB_TESTING = Platform.OS === 'web' && env.ENV === 'testing'
export const IS_WEB_STAGING = Platform.OS === 'web' && env.ENV === 'staging'
export const IS_WEB_PROD = Platform.OS === 'web' && env.ENV === 'production'
export const IS_WEB_RELEASE = IS_WEB_PROD

const WEB_SCREENS_FOR_RELEASE: ScreenNames[] = [
  'LocationFilter', // Search feature
  'LocationPicker', // Search feature
  'Offer',
  'OfferDescription',
  'PageNotFound',
  'Search', // Search feature
  'SearchCategories', // Search feature
  'SearchFilter', // Search feature
  'TabNavigator',
  'Venue',
]

function isScreenReleased(screenName: ScreenNames) {
  if (IS_WEB_RELEASE) {
    return WEB_SCREENS_FOR_RELEASE.includes(screenName)
  }
  return true
}

const routeRedirectWebToNative: Route = {
  name: 'RedirectWebToNative',
  component: RedirectWebToNative,
  path: 'redirection-vers-app-mobile',
  options: { title: t`Redirection vers l'application mobile` },
}

type RouteType = Route | TabRoute
export function redirectUnreleasedScreens(routes: TabRoute[]): TabRoute[]
export function redirectUnreleasedScreens(routes: Route[]): Route[]
export function redirectUnreleasedScreens(routes: RouteType[]): RouteType[] {
  return routes.map((route) => {
    if (isScreenReleased(route.name)) {
      return route
    }
    route.component = routeRedirectWebToNative.component
    route.options = routeRedirectWebToNative.options
    return route
  })
}
