import { getMaintenance } from 'libs/firebase/firestore/getMaintenance/getMaintenance'
import { FIRESTORE_ROOT_COLLECTION, RemoteStoreDocuments } from 'libs/firebase/firestore/types'
import { doc, getDoc, getFirestore } from 'libs/firebase/shims/firestore'
import { captureMonitoringError } from 'libs/monitoring/errors'
import { waitFor } from 'tests/utils'

jest.mock('@react-native-firebase/firestore')
jest.mock('libs/monitoring/errors')

const firestoreInstance = getFirestore()

const mockGet = getDoc as jest.Mock

describe('getMaintenance', () => {
  beforeAll(() =>
    doc(firestoreInstance, FIRESTORE_ROOT_COLLECTION, RemoteStoreDocuments.MAINTENANCE)
  )

  it('should call the right firestore collection: maintenance', () => {
    getMaintenance()

    expect(doc).toHaveBeenCalledWith({}, 'root', 'maintenance')
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
