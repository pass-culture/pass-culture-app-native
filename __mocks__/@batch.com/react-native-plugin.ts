export { BatchEvent } from 'libs/react-native-batch/enums'

export const Batch = {
  start: jest.fn(),
  optIn: jest.fn(),
  optOut: jest.fn(),
}

export const BatchProfile = {
  editor: jest.fn(() => ({
    setAttribute: jest.fn(),
    save: jest.fn(),
  })),
  identify: jest.fn().mockReturnThis(),
  trackEvent: jest.fn(),
  trackLocation: jest.fn(),
}

export const BatchUser = {
  getInstallationID: jest.fn(),
}

export const BatchPush = {
  requestNotificationAuthorization: jest.fn(),
  refreshToken: jest.fn(),
}

export const BatchMessaging = {
  setFontOverride: jest.fn(),
}

export class BatchEventAttributes {
  put(key: string, value: string) {
    return Object.assign(this, { [key]: value })
  }
}
