import { FirebaseAnalyticsTypes } from '@react-native-firebase/analytics'

type AnalyticsReturn = Partial<FirebaseAnalyticsTypes.Module>

export const firebaseAnalytics: jest.Mocked<AnalyticsReturn> = {
  logEvent: jest.fn(),
  logLogin: jest.fn(),
  logScreenView: jest.fn(),
}

export const analytics = {
  logScreenView: jest.fn(),
  logAllModulesSeen: jest.fn(),
  logAllTilesSeen: jest.fn(),
  logConsultOffer: jest.fn(),
  logClickExclusivityBlock: jest.fn(),
  logClickSeeMore: jest.fn(),
  logClickBusinessBlock: jest.fn(),
  logClickWhyAnniversary: jest.fn(),
  logConsultOfferFromDeeplink: jest.fn(),
  logConsultAccessibility: jest.fn(),
  logConsultWithdrawal: jest.fn(),
  logConsultDescriptionDetails: jest.fn(),
  logConsultItinerary: jest.fn(),
  logShareOffer: jest.fn(),
  logConsultWholeOffer: jest.fn(),
  logCancelSignup: jest.fn(),
}
