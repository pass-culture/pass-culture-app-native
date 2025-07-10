// eslint-disable-next-line no-restricted-imports
import { FirebaseRemoteConfigTypes } from '@react-native-firebase/remote-config'

import { CustomRemoteConfig } from 'libs/firebase/remoteConfig/remoteConfig.types'

import { getConfigValue } from './getConfigValue'

export const getRemoteConfigFromConfigValues = (
  parameters: FirebaseRemoteConfigTypes.ConfigValues
): CustomRemoteConfig => ({
  test_param: getConfigValue(parameters.test_param).asString(),
  artistPageSubcategories: JSON.parse(
    getConfigValue(parameters.artistPageSubcategories).asString()
  ),
  aroundPrecision: JSON.parse(getConfigValue(parameters.aroundPrecision).asString()),
  homeEntryIdBeneficiary: getConfigValue(parameters.homeEntryIdBeneficiary).asString(),
  homeEntryIdFreeBeneficiary: getConfigValue(parameters.homeEntryIdFreeBeneficiary).asString(),
  homeEntryIdFreeOffers: getConfigValue(parameters.homeEntryIdFreeOffers).asString(),
  homeEntryIdNotConnected: getConfigValue(parameters.homeEntryIdNotConnected).asString(),
  homeEntryIdGeneral: getConfigValue(parameters.homeEntryIdGeneral).asString(),
  homeEntryIdOnboardingGeneral: getConfigValue(parameters.homeEntryIdOnboardingGeneral).asString(),
  homeEntryIdOnboardingUnderage: getConfigValue(
    parameters.homeEntryIdOnboardingUnderage
  ).asString(),
  homeEntryIdOnboarding_18: getConfigValue(parameters.homeEntryIdOnboarding_18).asString(),
  homeEntryIdWithoutBooking: getConfigValue(parameters.homeEntryIdWithoutBooking).asString(),
  homeEntryIdWithoutBooking_18: getConfigValue(parameters.homeEntryIdWithoutBooking_18).asString(),
  homeEntryIdWithoutBooking_15_17: getConfigValue(
    parameters.homeEntryIdWithoutBooking_15_17
  ).asString(),
  homeEntryId_18: getConfigValue(parameters.homeEntryId_18).asString(),
  homeEntryId_15_17: getConfigValue(parameters.homeEntryId_15_17).asString(),
  reactionFakeDoorCategories: JSON.parse(
    getConfigValue(parameters.reactionFakeDoorCategories).asString()
  ),
  sameAuthorPlaylist: getConfigValue(parameters.sameAuthorPlaylist).asString(),
  shouldDisplayReassuranceMention: getConfigValue(
    parameters.shouldDisplayReassuranceMention
  ).asBoolean(),
  shouldLogInfo: getConfigValue(parameters.shouldLogInfo).asBoolean(),
  displayInAppFeedback: getConfigValue(parameters.displayInAppFeedback).asBoolean(),
  subscriptionHomeEntryIds: JSON.parse(
    getConfigValue(parameters.subscriptionHomeEntryIds).asString()
  ),
  shareAppModalVersion: getConfigValue(
    parameters.shareAppModalVersion
  ).asString() as CustomRemoteConfig['shareAppModalVersion'],
  showAccessScreeningButton: getConfigValue(parameters.showAccessScreeningButton).asBoolean(),
})
