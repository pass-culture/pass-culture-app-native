import { getBanner } from 'libs/firebase/firestore/getBanner/getBanner'
import { FIRESTORE_ROOT_COLLECTION, RemoteStoreDocuments } from 'libs/firebase/firestore/types'
import firestore from 'libs/firebase/shims/firestore'
import { captureMonitoringError } from 'libs/monitoring'
import { waitFor } from 'tests/utils'

jest.mock('@react-native-firebase/firestore')
jest.mock('libs/monitoring/errors')

const { collection } = firestore()
const { get } = collection(FIRESTORE_ROOT_COLLECTION).doc(RemoteStoreDocuments.BANNER)
const mockGet = get as jest.Mock

describe('getBanner', () => {
  it('should call the right firestore collection: banner', () => {
    getBanner()

    expect(collection).toHaveBeenCalledWith('root')
    expect(collection('root').doc).toHaveBeenCalledWith('banner')
  })

  it('should call captureMonitoringError when Firestore throws an error', async () => {
    mockGet.mockRejectedValueOnce(new Error('Firestore error'))
    getBanner()

    await waitFor(() => {
      expect(captureMonitoringError).toHaveBeenCalledWith(
        'Firestore error',
        'firestore_not_available'
      )
    })
  })
})
