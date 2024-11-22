import 'jest-canvas-mock'

jest.unmock('react-native-modal')
jest.mock('libs/firebase/firestore/client.web', () => {
  const firestoreRemoteStore = jest.requireActual('libs/firebase/shims/firestore/index.web')
  firestoreRemoteStore.settings({ experimentalAutoDetectLongPolling: true, merge: true })
  return {
    __esModule: true,
    default: firestoreRemoteStore,
  }
})

window.open = jest.fn()

export {}
