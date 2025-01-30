import { getMaintenance } from 'libs/firebase/firestore/getMaintenance/getMaintenance'
import { FIRESTORE_ROOT_COLLECTION, RemoteStoreDocuments } from 'libs/firebase/firestore/types'
import firestore from 'libs/firebase/shims/firestore'
import { captureMonitoringError } from 'libs/monitoring/errors'
import { waitFor } from 'tests/utils'

jest.mock('@react-native-firebase/firestore')
jest.mock('libs/monitoring/errors')

const { collection } = firestore()
const { get } = collection(FIRESTORE_ROOT_COLLECTION).doc(RemoteStoreDocuments.MAINTENANCE)
const mockGet = get as jest.Mock

describe('getMaintenance', () => {
  it('should call the right firestore collection: maintenance', () => {
    getMaintenance()

    expect(collection).toHaveBeenCalledWith('root')
    expect(collection('root').doc).toHaveBeenCalledWith('maintenance')
  })

  it('should call captureMonitoringError when Firestore throws an error', async () => {
    mockGet.mockRejectedValueOnce(new Error('Firestore error'))
    getMaintenance()

    await waitFor(() => {
      expect(captureMonitoringError).toHaveBeenCalledWith(
        'Firestore error',
        'firestore_not_available'
      )
    })
  })
})
