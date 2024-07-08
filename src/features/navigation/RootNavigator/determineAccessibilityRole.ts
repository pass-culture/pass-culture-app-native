import { Route } from '@react-navigation/native'

import { ScreenNames } from 'features/navigation/RootNavigator/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'

export function determineAccessibilityRole(currentRoute: Route<string> | null) {
  const currentRouteParams = currentRoute?.params
  const pageWithFooter: ScreenNames[] = ['Home', 'Profile']

  let mainAccessibilityRole: AccessibilityRole | undefined = AccessibilityRole.MAIN
  if (
    typeof currentRouteParams === 'object' &&
    'screen' in currentRouteParams &&
    (pageWithFooter.includes(currentRouteParams?.screen as ScreenNames) ||
      (currentRouteParams?.screen as ScreenNames) === undefined)
    // when arriving on the app for the first time, 'screen' is undefined
    // this might create issues when entering the app from other places then home
  ) {
    mainAccessibilityRole = undefined // we set it to undefined to let the pages handle were the main should be
  }
  return mainAccessibilityRole
}
