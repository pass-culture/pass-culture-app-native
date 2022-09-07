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
