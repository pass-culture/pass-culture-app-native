enum PositionError {
  PERMISSION_DENIED = 1,
  POSITION_UNAVAILABLE = 2,
  TIMEOUT = 3,
  PLAY_SERVICE_NOT_AVAILABLE = 4,
  SETTINGS_NOT_SATISFIED = 5,
  INTERNAL_ERROR = -1,
}

module.exports = {
  addListener: jest.fn(),
  getCurrentPosition: jest.fn(),
  PositionError,
  removeListeners: jest.fn(),
  requestAuthorization: jest.fn().mockResolvedValue('granted'),
  setConfiguration: jest.fn(),
  startObserving: jest.fn(),
  stopObserving: jest.fn(),
}

export {}
