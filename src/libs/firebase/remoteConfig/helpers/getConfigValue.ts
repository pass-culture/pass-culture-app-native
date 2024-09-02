// eslint-disable-next-line no-restricted-imports
import { FirebaseRemoteConfigTypes } from '@react-native-firebase/remote-config'

function isConfigValue(value: unknown): value is FirebaseRemoteConfigTypes.ConfigValue {
  if (!value) {
    return false
  }

  const config = value as FirebaseRemoteConfigTypes.ConfigValue
  return (
    typeof config.asString === 'function' &&
    typeof config.asBoolean === 'function' &&
    typeof config.asNumber === 'function' &&
    typeof config.getSource === 'function'
  )
}

export const getConfigValue = (value?: FirebaseRemoteConfigTypes.ConfigValue) => {
  if (isConfigValue(value)) {
    return value
  }
  return {
    asBoolean: () => false,
    asNumber: () => 0,
    asString: () => '',
    getSource: () => 'static',
  } satisfies FirebaseRemoteConfigTypes.ConfigValue
}
