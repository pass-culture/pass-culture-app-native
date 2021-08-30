export const Batch = {
  start: jest.fn(),
}

export const BatchUser = {
  getInstallationID: jest.fn(),
  editor: jest.fn().mockReturnThis(),
  setIdentifier: jest.fn().mockReturnThis(),
  save: jest.fn(),
}

export const BatchPush = {
  registerForRemoteNotifications: jest.fn(),
}
