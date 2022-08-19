import firebaseRemoteConfig from 'libs/firebase/shims/remote-config'

import { DEFAULT_REMOTE_CONFIG } from './remoteConfig.constants'
import { CustomRemoteConfig, GenericRemoteConfig } from './remoteConfig.types'

export const remoteConfig = {
  async configure() {
    await firebaseRemoteConfig().setDefaults(DEFAULT_REMOTE_CONFIG as GenericRemoteConfig)
  },
  async refresh() {
    return await firebaseRemoteConfig().fetchAndActivate()
  },
  /**
  `getValues()` does not fetch anything, it accesses the values fetched by `firebaseRemoteConfig().fetchAndActivate()`.
  So be sure to have your remote config refreshed before using `getValues()`.
  *
  * @returns object with remote config params.
  */
  getValues(): CustomRemoteConfig {
    const parameters = firebaseRemoteConfig().getAll()
    return {
      test_param: parameters.test_param.asString() as CustomRemoteConfig['test_param'],
      homeEntryId: parameters.homeEntryId.asString() as CustomRemoteConfig['homeEntryId'],
    }
  },
}
