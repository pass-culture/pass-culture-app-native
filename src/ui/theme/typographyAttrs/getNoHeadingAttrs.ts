import { Platform } from 'react-native'

import { getTextAttrs } from 'ui/theme/typographyAttrs/getTextAttrs'

export const getNoHeadingAttrs = () => ({
  ...(Platform.OS === 'web'
    ? {
        accessibilityRole: undefined,
        accessibilityLevel: undefined,
        ...getTextAttrs(),
      }
    : {}),
})
