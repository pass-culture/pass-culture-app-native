import 'jest-canvas-mock'
import mockFirestore from 'libs/firebase/shims/firestore/index.web'

jest.unmock('react-native-modal')
jest.mock('libs/firebase/firestore/client.web', () => {
  const firestoreRemoteStore = mockFirestore()
  firestoreRemoteStore.settings({ experimentalAutoDetectLongPolling: true, merge: true })
  return {
    __esModule: true,
    default: firestoreRemoteStore,
  }
})

window.open = jest.fn()

export {}
