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
  setAttribute: jest.fn().mockReturnThis(),
  trackEvent: jest.fn(),
  save: jest.fn(),
}

export const BatchPush = {
  requestNotificationAuthorization: jest.fn(),
}

export const BatchMessaging = {
  setFontOverride: jest.fn(),
}

export class BatchEventData {
  addTag() {
    return this
  }
  putDate() {
    return this
  }
  putURL() {
    return this
  }
  put(key: string, value: string) {
    return Object.assign(this, { [key]: value })
  }
}
