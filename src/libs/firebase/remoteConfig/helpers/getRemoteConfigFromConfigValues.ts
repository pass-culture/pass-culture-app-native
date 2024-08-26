// eslint-disable-next-line no-restricted-imports
import { FirebaseRemoteConfigTypes } from '@react-native-firebase/remote-config'

import { CustomRemoteConfig, ShareAppTrigger } from 'libs/firebase/remoteConfig/remoteConfig.types'

import { getConfigValue } from './getConfigValue'

export const getRemoteConfigFromConfigValues = (
  parameters: FirebaseRemoteConfigTypes.ConfigValues
): CustomRemoteConfig => ({
  test_param: getConfigValue(parameters.test_param).asString(),
  homeEntryIdFreeOffers: getConfigValue(parameters.homeEntryIdFreeOffers).asString(),
  homeEntryIdNotConnected: getConfigValue(parameters.homeEntryIdNotConnected).asString(),
  homeEntryIdGeneral: getConfigValue(parameters.homeEntryIdGeneral).asString(),
  homeEntryIdOnboardingGeneral: getConfigValue(parameters.homeEntryIdOnboardingGeneral).asString(),
  homeEntryIdOnboardingUnderage: getConfigValue(
    parameters.homeEntryIdOnboardingUnderage
  ).asString(),
  homeEntryIdOnboarding_18: getConfigValue(parameters.homeEntryIdOnboarding_18).asString(),
  homeEntryIdWithoutBooking_18: getConfigValue(parameters.homeEntryIdWithoutBooking_18).asString(),
  homeEntryIdWithoutBooking_15_17: getConfigValue(
    parameters.homeEntryIdWithoutBooking_15_17
  ).asString(),
  homeEntryId_18: getConfigValue(parameters.homeEntryId_18).asString(),
  homeEntryId_15_17: getConfigValue(parameters.homeEntryId_15_17).asString(),
  reactionFakeDoorCategories: JSON.parse(
    getConfigValue(parameters.reactionFakeDoorCategories).asString()
  ),
  reactionCategories: JSON.parse(getConfigValue(parameters.reactionCategories).asString()),
  sameAuthorPlaylist: getConfigValue(parameters.sameAuthorPlaylist).asString(),
  shouldApplyGraphicRedesign: getConfigValue(parameters.shouldApplyGraphicRedesign).asBoolean(),
  shouldDisplayReassuranceMention: getConfigValue(
    parameters.shouldDisplayReassuranceMention
  ).asBoolean(),
  shouldLogInfo: getConfigValue(parameters.shouldLogInfo).asBoolean(),
  displayInAppFeedback: getConfigValue(parameters.displayInAppFeedback).asBoolean(),
  subscriptionHomeEntryIds: JSON.parse(
    getConfigValue(parameters.subscriptionHomeEntryIds).asString()
  ),
  shareAppTrigger:
    (getConfigValue(parameters.shareAppTrigger)?.asString() as ShareAppTrigger | undefined) ??
    'default',
})
