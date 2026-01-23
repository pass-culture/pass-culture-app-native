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
  homeEntryIdGeneral: getConfigValue(parameters.homeEntryIdGeneral).asString(),
  homeEntryIdWithoutBooking: getConfigValue(parameters.homeEntryIdWithoutBooking).asString(),
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
  displayMandatoryUpdatePersonalData: getConfigValue(
    parameters.displayMandatoryUpdatePersonalData
  ).asBoolean(),
})
