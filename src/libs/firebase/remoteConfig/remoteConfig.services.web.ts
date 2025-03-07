import { fetchAndActivate, getAll } from 'firebase/remote-config'

// .web extension until universal interface is supported by react-native-firebase
// See https://github.com/invertase/react-native-firebase/discussions/6562
import { getRemoteConfigFromConfigValues } from 'libs/firebase/remoteConfig/helpers/getRemoteConfigFromConfigValues'
import firebaseRemoteConfig from 'libs/firebase/shims/remote-config/index.web'

import { CustomRemoteConfig, RemoteConfigServices } from './remoteConfig.types'

export const remoteConfig: RemoteConfigServices = {
  async refresh() {
    return fetchAndActivate(firebaseRemoteConfig)
  },
  // `getValues()` does not fetch anything, it accesses the values fetched by fetchAndActivate()`.
  // So be sure to have your remote config refreshed before using `getValues()`.
  getValues(): CustomRemoteConfig {
    const parameters = getAll(firebaseRemoteConfig)
    return getRemoteConfigFromConfigValues(parameters)
  },
  async configure() {
    // On Web, we don't need any specific configuration.
    // This method is included to maintain compatibility with the RemoteConfigServices interface,
    // but it remains empty since no additional setup is required on this platform.
  },
}
