// eslint-disable-next-line no-restricted-imports
import {
  getRemoteConfig,
  setDefaults,
  fetchAndActivate,
  getAll,
} from '@react-native-firebase/remote-config'

const remoteConfigInstance = getRemoteConfig()

export { remoteConfigInstance, setDefaults, fetchAndActivate, getAll }
