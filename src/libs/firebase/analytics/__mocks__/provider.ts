import { AnalyticsProvider } from '../types'

export const analyticsProvider: AnalyticsProvider = {
  enableCollection: jest.fn(),
  disableCollection: jest.fn(),
  setDefaultEventParameters: jest.fn(),
  setUserId: jest.fn(),
  logScreenView: jest.fn(),
  logLogin: jest.fn(),
  logEvent: jest.fn(),
}
