import type { AppStateStatus } from 'react-native'

declare module 'react-native' {
  interface AppStateStatic {
    __triggerChange: (state: AppStateStatus) => void
  }
}

const RealReactNative = jest.requireActual('react-native')

type AppStateCallback = (state: AppStateStatus) => void
const appStateListeners = new Map<string, AppStateCallback>()

const AppStateMock = {
  currentState: 'active' as AppStateStatus,

  addEventListener: jest.fn((type: string, callback: AppStateCallback) => {
    appStateListeners.set(type, callback)
    return {
      remove: jest.fn(() => {
        appStateListeners.delete(type)
      }),
    }
  }),

  __triggerChange: (nextState: AppStateStatus) => {
    AppStateMock.currentState = nextState
    const callback = appStateListeners.get('change')
    if (callback) {
      callback(nextState)
    }
  },
}

const LinkingMock = {
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  canOpenURL: jest.fn().mockResolvedValue(true),
  getInitialURL: jest.fn().mockResolvedValue(null),
  openSettings: jest.fn().mockResolvedValue(undefined),
  openURL: jest.fn().mockResolvedValue(undefined),
  removeEventListener: jest.fn(),
}

const descriptors = Object.getOwnPropertyDescriptors(RealReactNative)
delete descriptors.AppState
delete descriptors.Linking
delete descriptors.NativeModules

const mock = {}
Object.defineProperties(mock, descriptors)
// @ts-ignore: AppState is a getter in the original module and we want to override it with our mock
mock.AppState = AppStateMock
// @ts-ignore: Linking is a getter in the original module and we want to override it with our mock
mock.Linking = LinkingMock
// @ts-ignore: NativeModules is a getter in the original module and we want to override it with our mock
mock.NativeModules = {
  ...RealReactNative.NativeModules,
  DefaultBrowserModule: { openUrl: jest.fn() },
}

module.exports = mock
