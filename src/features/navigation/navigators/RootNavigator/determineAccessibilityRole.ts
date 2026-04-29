import { Route } from '@react-navigation/native'

import { ScreenNames } from 'features/navigation/navigators/RootNavigator/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'

export function determineAccessibilityRole(currentRoute: Route<string> | null) {
  const currentRouteParams = currentRoute?.params
  const pageWithFooter: ScreenNames[] = ['Home', 'Profile']

  const doesCurrentRouteHaveFooter =
    currentRouteParams &&
    'screen' in currentRouteParams &&
    pageWithFooter.includes(currentRouteParams?.screen as ScreenNames)

  // when arriving on the app, currentRouteParams is undefined
  // this might create issues when entering the app from other places then home
  const mainAccessibilityRole: AccessibilityRole | undefined =
    !currentRouteParams || doesCurrentRouteHaveFooter ? undefined : AccessibilityRole.MAIN

  return mainAccessibilityRole
}
