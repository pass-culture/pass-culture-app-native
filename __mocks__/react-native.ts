import type { AppStateStatus } from 'react-native'

declare module 'react-native' {
  interface AppStateStatic {
    __triggerChange: (state: AppStateStatus) => void
  }
}

const RealReactNative = jest.requireActual('react-native')

type AppStateCallback = (state: AppStateStatus) => void
const listeners = new Map<string, AppStateCallback>()

const AppStateMock = {
  currentState: 'active' as AppStateStatus,

  addEventListener: jest.fn((type: string, callback: AppStateCallback) => {
    listeners.set(type, callback)
    return {
      remove: jest.fn(() => {
        listeners.delete(type)
      }),
    }
  }),

  __triggerChange: (nextState: AppStateStatus) => {
    AppStateMock.currentState = nextState
    const callback = listeners.get('change')
    if (callback) {
      callback(nextState)
    }
  },
}

const descriptors = Object.getOwnPropertyDescriptors(RealReactNative)
// We remove AppState from descriptors to avoid conflicts with our mock
delete descriptors.AppState

const mock = {}
Object.defineProperties(mock, descriptors)
// @ts-ignore: AppState is a getter in the original module and we want to override it with our mock
mock.AppState = AppStateMock

module.exports = mock
