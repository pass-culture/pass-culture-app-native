import { logEventAnalytics } from 'libs/analytics/__mocks__/logEventAnalytics'
import { AnalyticsProvider } from 'libs/analytics/types'

export const analytics: AnalyticsProvider = {
  enableCollection: jest.fn(),
  disableCollection: jest.fn(),
  logScreenView: jest.fn(),
  logEvent: jest.fn(),
  ...logEventAnalytics,
}
