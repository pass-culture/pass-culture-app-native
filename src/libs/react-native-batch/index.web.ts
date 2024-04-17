export { BatchEvent } from 'libs/react-native-batch/enums'

/* eslint-disable @typescript-eslint/no-empty-function */
export const Batch = {
  start() {},
  optIn() {},
  optOut() {},
}

export const BatchUser = {
  getInstallationID() {
    return Promise.resolve()
  },
  editor() {
    return this
  },
  setIdentifier() {
    return this
  },
  trackEvent() {},
  save() {},
}

export const BatchPush = {
  requestNotificationAuthorization() {},
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

  put() {
    return this
  }
}
