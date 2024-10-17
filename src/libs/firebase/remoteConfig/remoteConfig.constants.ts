import { SubscriptionTheme } from 'features/subscription/types'

import { CustomRemoteConfig } from './remoteConfig.types'

export const DEFAULT_REMOTE_CONFIG: CustomRemoteConfig = {
  test_param: 'A',
  homeEntryIdFreeOffers: '',
  homeEntryIdNotConnected: '',
  homeEntryIdGeneral: '',
  homeEntryIdOnboardingGeneral: '',
  homeEntryIdOnboardingUnderage: '',
  homeEntryIdOnboarding_18: '',
  homeEntryIdWithoutBooking_18: '',
  homeEntryIdWithoutBooking_15_17: '',
  homeEntryId_18: '',
  homeEntryId_15_17: '',
  reactionFakeDoorCategories: {
    categories: [],
  },
  reactionCategories: {
    categories: [],
  },
  sameAuthorPlaylist: '',
  shouldApplyGraphicRedesign: false,
  shouldDisplayReassuranceMention: false,
  shouldLogInfo: false,
  displayInAppFeedback: false,
  subscriptionHomeEntryIds: {
    [SubscriptionTheme.CINEMA]: '',
    [SubscriptionTheme.MUSIQUE]: '',
    [SubscriptionTheme.LECTURE]: '',
    [SubscriptionTheme.SPECTACLES]: '',
    [SubscriptionTheme.VISITES]: '',
    [SubscriptionTheme.ACTIVITES]: '',
  },
}
