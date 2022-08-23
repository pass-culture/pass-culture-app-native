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
      homeEntryIdNotConnected:
        parameters.homeEntryIdNotConnected.asString() as CustomRemoteConfig['homeEntryIdNotConnected'],
      homeEntryIdGeneral:
        parameters.homeEntryIdGeneral.asString() as CustomRemoteConfig['homeEntryIdGeneral'],
      homeEntryIdWithoutBooking_18:
        parameters.homeEntryIdWithoutBooking_18.asString() as CustomRemoteConfig['homeEntryIdWithoutBooking_18'],
      homeEntryIdWithoutBooking_15_17:
        parameters.homeEntryIdWithoutBooking_15_17.asString() as CustomRemoteConfig['homeEntryIdWithoutBooking_15_17'],
      homeEntryId_18: parameters.homeEntryId_18.asString() as CustomRemoteConfig['homeEntryId_18'],
      homeEntryId_15_17:
        parameters.homeEntryId_15_17.asString() as CustomRemoteConfig['homeEntryId_15_17'],
    }
  },
}
