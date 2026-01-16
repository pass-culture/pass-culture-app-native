import { Platform } from 'react-native'

export const getPlatformLabel = (): 'iOS' | 'Android' | 'Web' => {
  if (Platform.OS === 'ios') return 'iOS'
  if (Platform.OS === 'android') return 'Android'
  return 'Web'
}
