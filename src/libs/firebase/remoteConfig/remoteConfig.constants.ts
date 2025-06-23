import { SubcategoryIdEnum } from 'api/gen'
import { SubscriptionTheme } from 'features/subscription/types'

import { CustomRemoteConfig } from './remoteConfig.types'

export const DEFAULT_REMOTE_CONFIG: CustomRemoteConfig = {
  test_param: 'A',
  aroundPrecision: 0,
  artistPageSubcategories: {
    subcategories: [
      SubcategoryIdEnum.ABO_PLATEFORME_MUSIQUE,
      SubcategoryIdEnum.CAPTATION_MUSIQUE,
      SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_CD,
      SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE,
      SubcategoryIdEnum.TELECHARGEMENT_MUSIQUE,
      SubcategoryIdEnum.ABO_BIBLIOTHEQUE,
      SubcategoryIdEnum.ABO_LIVRE_NUMERIQUE,
      SubcategoryIdEnum.ABO_MEDIATHEQUE,
      SubcategoryIdEnum.FESTIVAL_LIVRE,
      SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE,
      SubcategoryIdEnum.LIVRE_NUMERIQUE,
      SubcategoryIdEnum.LIVRE_PAPIER,
      SubcategoryIdEnum.TELECHARGEMENT_LIVRE_AUDIO,
    ],
  },
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
