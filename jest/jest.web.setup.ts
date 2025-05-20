import 'jest-canvas-mock'
import mockFirestore from 'libs/firebase/shims/firestore/index.web'

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

jest.unmock('react-native-modal')
jest.mock('libs/firebase/firestore/client.web', () => {
  const firestoreRemoteStore = mockFirestore()
  firestoreRemoteStore.settings({ experimentalAutoDetectLongPolling: true, merge: true })
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
