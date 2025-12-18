import { getAllFeatureFlags } from 'libs/firebase/firestore/featureFlags/getAllFeatureFlags'
import { FIRESTORE_ROOT_COLLECTION, RemoteStoreDocuments } from 'libs/firebase/firestore/types'
import { doc, getDoc, getFirestore } from 'libs/firebase/shims/firestore'
import { eventMonitoring } from 'libs/monitoring/services'
import { waitFor } from 'tests/utils'

jest.mock('@react-native-firebase/firestore')
const mockGet = getDoc as jest.Mock

const firestoreInstance = getFirestore()

describe('getAllFeatureFlags', () => {
  it('should call the right firestore document', () => {
    getAllFeatureFlags()

    expect(doc).toHaveBeenCalledWith(
      firestoreInstance,
      FIRESTORE_ROOT_COLLECTION,
      RemoteStoreDocuments.FEATURE_FLAGS
    )
  })

  it('should send log to Sentry when Firestore throws an error', async () => {
    mockGet.mockRejectedValueOnce(new Error('error'))
    getAllFeatureFlags()

    await waitFor(() => {
      expect(eventMonitoring.captureException).toHaveBeenCalledWith(new Error('error'))
    })
  })
})
