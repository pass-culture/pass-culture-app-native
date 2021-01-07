import { FirebaseAnalyticsTypes } from '@react-native-firebase/analytics'

import { analytics as actualAnalytics } from '../analytics'

type AnalyticsReturn = Partial<FirebaseAnalyticsTypes.Module>

export const firebaseAnalytics: jest.Mocked<AnalyticsReturn> = {
  logEvent: jest.fn(),
  logLogin: jest.fn(),
  logScreenView: jest.fn(),
}

export const analytics: typeof actualAnalytics = {
  logAllModulesSeen: jest.fn(),
  logAllTilesSeen: jest.fn(),
  logCancelSignup: jest.fn(),
  logClickBookOffer: jest.fn(),
  logClickBusinessBlock: jest.fn(),
  logClickExclusivityBlock: jest.fn(),
  logClickSeeMore: jest.fn(),
  logClickWhyAnniversary: jest.fn(),
  logConsultAccessibility: jest.fn(),
  logConsultDescriptionDetails: jest.fn(),
  logConsultItinerary: jest.fn(),
  logConsultOffer: jest.fn(),
  logConsultOfferFromDeeplink: jest.fn(),
  logConsultWholeOffer: jest.fn(),
  logConsultWithdrawal: jest.fn(),
  logContactSupport: jest.fn(),
  logOfferSeenDuration: jest.fn(),
  logResendEmail: jest.fn(),
  logScreenView: jest.fn(),
  logShareOffer: jest.fn(),
}
