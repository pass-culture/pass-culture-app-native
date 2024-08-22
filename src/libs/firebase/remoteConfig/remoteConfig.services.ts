import firebaseRemoteConfig from 'libs/firebase/shims/remote-config'

import { DEFAULT_REMOTE_CONFIG } from './remoteConfig.constants'
import { CustomRemoteConfig, GenericRemoteConfig, ShareAppTrigger } from './remoteConfig.types'

export const remoteConfig = {
  async configure() {
    await firebaseRemoteConfig().setDefaults(DEFAULT_REMOTE_CONFIG as GenericRemoteConfig)
  },
  async refresh() {
    return firebaseRemoteConfig().fetchAndActivate()
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
      reactionCategories: JSON.parse(parameters.reactionCategories.asString()),
      // @ts-expect-error: because of noUncheckedIndexedAccess
      sameAuthorPlaylist: parameters.sameAuthorPlaylist.asString(),
      // @ts-expect-error: because of noUncheckedIndexedAccess
      shouldApplyGraphicRedesign: parameters.shouldApplyGraphicRedesign.asBoolean(),
      // @ts-expect-error: because of noUncheckedIndexedAccess
      shouldDisplayReassuranceMention: parameters.shouldDisplayReassuranceMention.asBoolean(),
      // @ts-expect-error: because of noUncheckedIndexedAccess
      shouldLogInfo: parameters.shouldLogInfo.asBoolean(),
      // @ts-expect-error: because of noUncheckedIndexedAccess
      displayInAppFeedback: parameters.displayInAppFeedback.asBoolean(),
      // @ts-expect-error: because of noUncheckedIndexedAccess
      subscriptionHomeEntryIds: JSON.parse(parameters.subscriptionHomeEntryIds.asString()),
      shareAppTrigger:
        (parameters.shareAppTrigger?.asString() as ShareAppTrigger | undefined) ?? 'default',
    }
  },
}
