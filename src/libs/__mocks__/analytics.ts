import { FirebaseAnalyticsTypes } from '@react-native-firebase/analytics'

type AnalyticsReturn = Partial<FirebaseAnalyticsTypes.Module>

export const analytics: jest.Mocked<AnalyticsReturn> = {
  logLogin: jest.fn(),
  logScreenView: jest.fn(),
  logEvent: jest.fn(),
}

export const logAllModulesSeen = jest.fn()
export const logAllTilesSeen = jest.fn()
export const logConsultOffer = jest.fn()
export const logClickExclusivityBlock = jest.fn()
export const logClickSeeMore = jest.fn()
export const logClickBusinessBlock = jest.fn()
