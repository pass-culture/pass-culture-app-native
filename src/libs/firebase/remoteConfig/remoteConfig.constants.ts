import { SubscriptionTheme } from 'features/subscription/types'

import { CustomRemoteConfig } from './remoteConfig.types'

export const DEFAULT_REMOTE_CONFIG: CustomRemoteConfig = {
  aroundPrecision: 0,
  artistPageSubcategories: { subcategories: [] },
  displayInAppFeedback: false,
  displayMandatoryUpdatePersonalData: false,
  homeEntryIdBeneficiary: '',
  homeEntryIdFreeBeneficiary: '',
  homeEntryIdFreeOffers: '',
  homeEntryIdGeneral: '',
  homeEntryIdWithoutBooking: '',
  reactionFakeDoorCategories: { categories: [] },
  sameAuthorPlaylist: '',
  shareAppModalVersion: 'default',
  shouldDisplayReassuranceMention: false,
  shouldLogInfo: false,
  showAccessScreeningButton: false,
  subscriptionHomeEntryIds: {
    [SubscriptionTheme.CINEMA]: '',
    [SubscriptionTheme.MUSIQUE]: '',
    [SubscriptionTheme.LECTURE]: '',
    [SubscriptionTheme.SPECTACLES]: '',
    [SubscriptionTheme.VISITES]: '',
    [SubscriptionTheme.ACTIVITES]: '',
  },
  test_param: 'A',
}
