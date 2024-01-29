import { Platform } from 'react-native'

export const ANIMATION_USE_NATIVE_DRIVER = Platform.select({
  default: false,
  ios: true,
  android: true,
})
