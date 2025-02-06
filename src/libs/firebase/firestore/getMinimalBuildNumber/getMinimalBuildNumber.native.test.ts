import { getMinimalBuildNumber } from 'libs/firebase/firestore/getMinimalBuildNumber/getMinimalBuildNumber'
import { FIRESTORE_ROOT_COLLECTION, RemoteStoreAppVersion } from 'libs/firebase/firestore/types'
import firestore from 'libs/firebase/shims/firestore'
import { eventMonitoring } from 'libs/monitoring/services'
import { waitFor } from 'tests/utils'

jest.mock('@react-native-firebase/firestore')

const { collection } = firestore()
const { get } = collection(FIRESTORE_ROOT_COLLECTION).doc(
  RemoteStoreAppVersion.MINIMAL_BUILD_NUMBER
)
const mockGet = get as jest.Mock

describe('getMinimalBuildNumber', () => {
  it('should call the right firestore collection: applicationVersions', () => {
    getMinimalBuildNumber()

    expect(collection).toHaveBeenCalledWith('root')
    expect(collection('root').doc).toHaveBeenCalledWith('applicationVersions')
  })

  it('should send log to Sentry when Firestore throws an error', async () => {
    mockGet.mockRejectedValueOnce(new Error('error'))
    getMinimalBuildNumber()

    await waitFor(() => {
      expect(eventMonitoring.captureException).toHaveBeenCalledWith(new Error('error'))
    })
  })
})
