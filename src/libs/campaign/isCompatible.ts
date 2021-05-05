import { Platform } from 'react-native'

export const isCompatible = () => {
  if (Platform.OS !== 'ios') return true
  if (typeof Platform.Version !== 'string') return false

  const [major, minor] = Platform.Version.split('.').map((x: string) => parseInt(x, 10))
  return major <= 14 && minor < 5
}
