import { FirebaseAnalyticsTypes } from '@react-native-firebase/analytics'

type AnalyticsReturn = Partial<FirebaseAnalyticsTypes.Module>

export const analytics: jest.Mocked<AnalyticsReturn> = {
  logLogin: jest.fn(),
  logScreenView: jest.fn(),
  logEvent: jest.fn(),
}

export const logAllModulesSeen = jest.fn()
