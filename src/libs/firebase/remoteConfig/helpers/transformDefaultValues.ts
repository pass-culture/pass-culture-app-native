import { FirebaseRemoteConfigTypes } from '@react-native-firebase/remote-config/lib'

export const transformDefaultValues = (
  values: Record<string, unknown>
): FirebaseRemoteConfigTypes.ConfigDefaults => {
  const formattedEntries = Object.entries(values).map(([key, value]) => {
    if (typeof value === 'object') {
      return [key, JSON.stringify(value)]
    }
    return [key, value]
  })
  return Object.fromEntries(formattedEntries)
}
