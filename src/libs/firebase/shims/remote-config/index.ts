/* eslint-disable no-restricted-imports */
import { getRemoteConfig } from '@react-native-firebase/remote-config'

export const remoteConfigInstance = getRemoteConfig()

export { setDefaults, fetchAndActivate, getAll } from '@react-native-firebase/remote-config'
