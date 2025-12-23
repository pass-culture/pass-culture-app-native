import { getMinimalBuildNumber } from 'libs/firebase/firestore/getMinimalBuildNumber/getMinimalBuildNumber'
import { FIRESTORE_ROOT_COLLECTION, RemoteStoreAppVersion } from 'libs/firebase/firestore/types'
import { doc, getDoc, getFirestore } from 'libs/firebase/shims/firestore'
import { eventMonitoring } from 'libs/monitoring/services'
import { waitFor } from 'tests/utils'

jest.mock('@react-native-firebase/firestore')

const firestoreInstance = getFirestore()

const mockGet = getDoc as jest.Mock

describe('getMinimalBuildNumber', () => {
  beforeAll(() =>
    doc(firestoreInstance, FIRESTORE_ROOT_COLLECTION, RemoteStoreAppVersion.MINIMAL_BUILD_NUMBER)
  )

  it('should call the right firestore collection: applicationVersions', async () => {
    await getMinimalBuildNumber()

    expect(doc).toHaveBeenCalledWith({}, 'root', 'applicationVersions')
  })

  it('should send log to Sentry when Firestore throws an error', async () => {
    mockGet.mockRejectedValueOnce(new Error('error'))
    await getMinimalBuildNumber()

    await waitFor(() => {
      expect(eventMonitoring.captureException).toHaveBeenCalledWith(new Error('error'))
    })
  })
})
