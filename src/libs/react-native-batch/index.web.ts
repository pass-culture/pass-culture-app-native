/* eslint-disable @typescript-eslint/no-empty-function */
export const Batch = {
  start() {},
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
  save() {},
}

export const BatchPush = {
  requestNotificationAuthorization() {},
}
