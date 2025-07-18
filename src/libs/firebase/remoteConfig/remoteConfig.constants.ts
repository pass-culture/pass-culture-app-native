import { SubscriptionTheme } from 'features/subscription/types'

import { CustomRemoteConfig } from './remoteConfig.types'

export const DEFAULT_REMOTE_CONFIG: CustomRemoteConfig = {
  test_param: 'A',
  aroundPrecision: 0,
  artistPageSubcategories: {
    subcategories: [],
  },
  homeEntryIdBeneficiary: '',
  homeEntryIdFreeBeneficiary: '',
  homeEntryIdFreeOffers: '',
  homeEntryIdGeneral: '',
  homeEntryIdWithoutBooking: '',
  reactionFakeDoorCategories: {
    categories: [],
  },
  sameAuthorPlaylist: '',
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
  shareAppModalVersion: 'default',
  showAccessScreeningButton: false,
}
