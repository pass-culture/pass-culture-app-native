export { BatchEvent } from 'libs/react-native-batch/enums'

export const Batch = {
  start: jest.fn(),
  optIn: jest.fn(),
  optOut: jest.fn(),
}

export const BatchUser = {
  getInstallationID: jest.fn(),
  editor: jest.fn().mockReturnThis(),
  setIdentifier: jest.fn().mockReturnThis(),
  trackEvent: jest.fn(),
  save: jest.fn(),
}

export const BatchPush = {
  requestNotificationAuthorization: jest.fn(),
}

export const BatchMessaging = {
  setFontOverride: jest.fn(),
}
