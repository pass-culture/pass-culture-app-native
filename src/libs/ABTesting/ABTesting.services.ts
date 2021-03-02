import firebaseRemoteConfig from '@react-native-firebase/remote-config'

import { DEFAULT_REMOTE_CONFIG } from './ABTesting.constants'
import { CustomRemoteConfig, GenericRemoteConfig } from './ABTesting.types'

export const abTesting = {
  async configure() {
    await firebaseRemoteConfig().setDefaults(DEFAULT_REMOTE_CONFIG as GenericRemoteConfig)
  },
  async refresh() {
    const isNewConfigRetrieved = await firebaseRemoteConfig().fetchAndActivate()
    return isNewConfigRetrieved
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
    }
  },
}
