import { Platform } from 'react-native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'

const isWeb = Platform.OS === 'web'

export const accessibilityRoleInternalNavigation = () => {
  if (isWeb) return AccessibilityRole.LINK
  return AccessibilityRole.BUTTON
}
