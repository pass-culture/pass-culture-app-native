import { fetchAndActivate, getAll } from 'firebase/remote-config'

// .web extension until universal interface is supported by react-native-firebase
// See https://github.com/invertase/react-native-firebase/discussions/6562
import firebaseRemoteConfig from 'libs/firebase/shims/remote-config/index.web'

import { CustomRemoteConfig, NotificationsTrigger } from './remoteConfig.types'

export const remoteConfig = {
  async refresh() {
    return await fetchAndActivate(firebaseRemoteConfig)
  },
  // `getValues()` does not fetch anything, it accesses the values fetched by fetchAndActivate()`.
  // So be sure to have your remote config refreshed before using `getValues()`.
  getValues(): CustomRemoteConfig {
    const parameters = getAll(firebaseRemoteConfig)
    return {
      test_param: parameters.test_param.asString(),
      homeEntryIdNotConnected: parameters.homeEntryIdNotConnected.asString(),
      homeEntryIdGeneral: parameters.homeEntryIdGeneral.asString(),
      homeEntryIdWithoutBooking_18: parameters.homeEntryIdWithoutBooking_18.asString(),
      homeEntryIdWithoutBooking_15_17: parameters.homeEntryIdWithoutBooking_15_17.asString(),
      homeEntryId_18: parameters.homeEntryId_18.asString(),
      homeEntryId_15_17: parameters.homeEntryId_15_17.asString(),
      notificationsTrigger: parameters.notificationsTrigger.asString() as NotificationsTrigger,
    }
  },
}
