import { AccessibilityRole, Platform } from 'react-native'

import { getTextAttrs } from 'ui/theme/typographyAttrs/getTextAttrs'

export const getHeadingAttrs = (level?: number) => ({
  ...(Platform.OS === 'web'
    ? {
        accessibilityRole: level ? ('header' as AccessibilityRole) : undefined,
        'aria-level': level,
        ...getTextAttrs(),
      }
    : {}),
})
