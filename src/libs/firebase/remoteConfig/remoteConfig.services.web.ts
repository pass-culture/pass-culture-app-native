import { fetchAndActivate, getAll } from 'firebase/remote-config'

// .web extension until universal interface is supported by react-native-firebase
// See https://github.com/invertase/react-native-firebase/discussions/6562
import { getRemoteConfigFromConfigValues } from 'libs/firebase/remoteConfig/helpers/getRemoteConfigFromConfigValues'
import firebaseRemoteConfig from 'libs/firebase/shims/remote-config/index.web'

import { CustomRemoteConfig } from './remoteConfig.types'

export const remoteConfig = {
  async refresh() {
    return fetchAndActivate(firebaseRemoteConfig)
  },
  // `getValues()` does not fetch anything, it accesses the values fetched by fetchAndActivate()`.
  // So be sure to have your remote config refreshed before using `getValues()`.
  getValues(): CustomRemoteConfig {
    const parameters = getAll(firebaseRemoteConfig)
    return {
      // @ts-expect-error: because of noUncheckedIndexedAccess
      test_param: parameters.test_param.asString(),
      // @ts-expect-error: because of noUncheckedIndexedAccess
      homeEntryIdFreeOffers: parameters.homeEntryIdFreeOffers.asString(),
      // @ts-expect-error: because of noUncheckedIndexedAccess
      homeEntryIdNotConnected: parameters.homeEntryIdNotConnected.asString(),
      // @ts-expect-error: because of noUncheckedIndexedAccess
      homeEntryIdGeneral: parameters.homeEntryIdGeneral.asString(),
      // @ts-expect-error: because of noUncheckedIndexedAccess
      homeEntryIdOnboardingGeneral: parameters.homeEntryIdOnboardingGeneral.asString(),
      // @ts-expect-error: because of noUncheckedIndexedAccess
      homeEntryIdOnboardingUnderage: parameters.homeEntryIdOnboardingUnderage.asString(),
      // @ts-expect-error: because of noUncheckedIndexedAccess
      homeEntryIdOnboarding_18: parameters.homeEntryIdOnboarding_18.asString(),
      // @ts-expect-error: because of noUncheckedIndexedAccess
      homeEntryIdWithoutBooking_18: parameters.homeEntryIdWithoutBooking_18.asString(),
      // @ts-expect-error: because of noUncheckedIndexedAccess
      homeEntryIdWithoutBooking_15_17: parameters.homeEntryIdWithoutBooking_15_17.asString(),
      // @ts-expect-error: because of noUncheckedIndexedAccess
      homeEntryId_18: parameters.homeEntryId_18.asString(),
      // @ts-expect-error: because of noUncheckedIndexedAccess
      homeEntryId_15_17: parameters.homeEntryId_15_17.asString(),
      // @ts-expect-error: because of noUncheckedIndexedAccess
      reactionFakeDoorCategories: JSON.parse(parameters.reactionFakeDoorCategories.asString()),
      // @ts-expect-error: because of noUncheckedIndexedAccess
      sameAuthorPlaylist: parameters.sameAuthorPlaylist.asString(),
      // @ts-expect-error: because of noUncheckedIndexedAccess
      shouldApplyGraphicRedesign: parameters.shouldApplyGraphicRedesign.asBoolean(),
      // @ts-expect-error: because of noUncheckedIndexedAccess
      shouldDisplayReassuranceMention: parameters.shouldDisplayReassuranceMention.asBoolean(),
      // @ts-expect-error: because of noUncheckedIndexedAccess
      shouldLogInfo: parameters.shouldLogInfo.asBoolean(),
      // @ts-expect-error: because of noUncheckedIndexedAccess
      subscriptionHomeEntryIds: JSON.parse(parameters.subscriptionHomeEntryIds.asString()),
    }
  },
}
