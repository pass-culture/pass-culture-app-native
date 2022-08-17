import { Platform } from 'react-native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
export const getHeadingAttrs = (level: HeadingLevel) => {
  return Platform.OS === 'web'
    ? {
        accessibilityRole: AccessibilityRole.HEADING,
        accessibilityLevel: level,
      }
    : {}
}
