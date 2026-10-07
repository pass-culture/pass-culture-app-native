import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'

// Home and Profile render their own main to keep their footer outside of it, TabNavigator delegates to its tabs
const screensWithoutMainLandmark = ['TabNavigator', 'Home', 'Profile']

// Must only depend on the screen: on web the role sets the DOM tag (div/main), changing it remounts the whole screen
export function determineAccessibilityRole(routeName: string): AccessibilityRole | undefined {
  return screensWithoutMainLandmark.includes(routeName) ? undefined : AccessibilityRole.MAIN
}
