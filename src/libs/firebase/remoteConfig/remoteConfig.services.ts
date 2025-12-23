import { getRemoteConfigFromConfigValues } from 'libs/firebase/remoteConfig/helpers/getRemoteConfigFromConfigValues'
import { transformDefaultValues } from 'libs/firebase/remoteConfig/helpers/transformDefaultValues'
import {
  remoteConfigInstance,
  fetchAndActivate,
  setDefaults,
  getAll,
} from 'libs/firebase/shims/remote-config'

import { DEFAULT_REMOTE_CONFIG } from './remoteConfig.constants'
import { CustomRemoteConfig, RemoteConfigServices } from './remoteConfig.types'

export const remoteConfig: RemoteConfigServices = {
  async configure() {
    await setDefaults(remoteConfigInstance, transformDefaultValues(DEFAULT_REMOTE_CONFIG))
  },
  async refresh() {
    return fetchAndActivate(remoteConfigInstance)
  },
  /**
  `getValues()` does not fetch anything, it accesses the values fetched by `fetchAndActivate(remoteConfigInstance)`.
  So be sure to have your remote config refreshed before using `getValues()`.
  *
  * @returns object with remote config params.
  */
  getValues(): CustomRemoteConfig {
    const parameters = getAll(remoteConfigInstance)
    return getRemoteConfigFromConfigValues(parameters)
  },
}
