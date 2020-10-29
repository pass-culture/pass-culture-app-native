import { FirebaseAnalyticsTypes } from '@react-native-firebase/analytics'

type AnalyticsReturn = Partial<FirebaseAnalyticsTypes.Module>

export const analytics: jest.Mocked<AnalyticsReturn> = {
  logLogin: jest.fn(),
  logScreenView: jest.fn(),
}
