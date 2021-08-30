const { PositionError } = jest.requireActual('react-native-geolocation-service')

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
