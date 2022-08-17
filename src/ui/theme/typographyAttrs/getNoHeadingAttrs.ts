import { Platform } from 'react-native'

export const getNoHeadingAttrs = () => ({
  ...(Platform.OS === 'web'
    ? {
        accessibilityRole: undefined,
        accessibilityLevel: undefined,
      }
    : {}),
})
