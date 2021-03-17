import { FirebaseAnalyticsTypes } from '@react-native-firebase/analytics'

import { analytics as actualAnalytics } from '../analytics'

type AnalyticsReturn = Partial<FirebaseAnalyticsTypes.Module>

export const firebaseAnalytics: jest.Mocked<AnalyticsReturn> = {
  logEvent: jest.fn(),
  logLogin: jest.fn(),
  logScreenView: jest.fn(),
  setAnalyticsCollectionEnabled: jest.fn(),
}

export const analytics: typeof actualAnalytics = {
  logAllModulesSeen: jest.fn(),
  logAllTilesSeen: jest.fn(),
  logCancelSignup: jest.fn(),
  logClickBookOffer: jest.fn(),
  logClickBusinessBlock: jest.fn(),
  logClickExclusivityBlock: jest.fn(),
  logClickSeeMore: jest.fn(),
  logConsultAccessibility: jest.fn(),
  logConsultAvailableDates: jest.fn(),
  logConsultDescriptionDetails: jest.fn(),
  logConsultItinerary: jest.fn(),
  logConsultOffer: jest.fn(),
  logConsultOfferFromDeeplink: jest.fn(),
  logConsultWholeOffer: jest.fn(),
  logConsultWhyAnniversary: jest.fn(),
  logConsultWithdrawal: jest.fn(),
  logContactSupportResetPasswordEmailSent: jest.fn(),
  logContactSupportSignupConfirmationEmailSent: jest.fn(),
  logNoSearchResult: jest.fn(),
  logOfferSeenDuration: jest.fn(),
  logRecommendationModuleSeen: jest.fn(),
  logReinitializeFilters: jest.fn(),
  logResendEmailResetPasswordExpiredLink: jest.fn(),
  logResendEmailSignupConfirmationExpiredLink: jest.fn(),
  logScreenView: jest.fn(),
  logSearchScrollToPage: jest.fn(),
  logShareOffer: jest.fn(),
  logSignUpBetween14And15Included: jest.fn(),
  logSignUpLessThanOrEqualTo13: jest.fn(),
  logUseFilter: jest.fn(),
  logSearchQuery: jest.fn(),
  logHasSkippedTutorial: jest.fn(),
  logHasActivateGeolocFromTutorial: jest.fn(),
  logHasAddedOfferToFavorites: jest.fn(),
}
