export { BatchEvent } from 'libs/react-native-batch/enums'

/* eslint-disable @typescript-eslint/no-empty-function */
export const Batch = {
  start() {},
  optIn() {},
  optOut() {},
}

export const BatchProfile = {
  editor() {
    return {
      setAttribute: () => {},
      save: () => {},
    }
  },
  identify() {
    return this
  },
  trackEvent() {},
  trackLocation() {},
}

export const BatchUser = {
  getInstallationID() {
    return Promise.resolve()
  },
}

export const BatchPush = {
  requestNotificationAuthorization() {},
}
export class BatchEventAttributes {
  put() {
    return this
  }
}
