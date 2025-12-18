/* eslint-disable @typescript-eslint/no-var-requires */
// We have "require" modules to avoid hoisting issues
import 'jest-canvas-mock'

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

jest.unmock('react-native-modal')
jest.mock('libs/firebase/firestore/client.web', () => {
  const { initializeApp } = require('firebase/app')
  const { FIREBASE_CONFIG } = require('libs/firebase/firebaseConfig')
  const {
    initializeFirestore,
    persistentLocalCache,
    persistentMultipleTabManager,
  } = require('libs/firebase/shims/firestore/index.web')

  const app = initializeApp(FIREBASE_CONFIG)

  const firestoreRemoteStore = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  })

  return {
    __esModule: true,
    default: firestoreRemoteStore,
  }
})

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

window.open = jest.fn()

export {}
