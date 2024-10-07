import { getAllFeatureFlags } from 'libs/firebase/firestore/featureFlags/getAllFeatureFlags'
import { FIRESTORE_ROOT_COLLECTION, RemoteStoreDocuments } from 'libs/firebase/firestore/types'
import firestore from 'libs/firebase/shims/firestore'
import { eventMonitoring } from 'libs/monitoring'
import { waitFor } from 'tests/utils'

jest.mock('@react-native-firebase/firestore')

const { collection } = firestore()
const { get } = collection(FIRESTORE_ROOT_COLLECTION).doc(RemoteStoreDocuments.FEATURE_FLAGS)
const mockGet = get as jest.Mock

describe('getAllFeatureFlags', () => {
  it('should call the right firestore collection: featureFlags', () => {
    getAllFeatureFlags()

    expect(collection).toHaveBeenCalledWith('root')
    expect(collection('root').doc).toHaveBeenCalledWith('featureFlags')
  })

  it('should send log to Sentry when Firestore throws an error', async () => {
    mockGet.mockRejectedValueOnce(new Error('error'))
    getAllFeatureFlags()

    await waitFor(() => {
      expect(eventMonitoring.captureException).toHaveBeenCalledWith(new Error('error'))
    })
  })
})
