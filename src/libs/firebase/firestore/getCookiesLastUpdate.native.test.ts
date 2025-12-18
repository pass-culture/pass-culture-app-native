import { FIRESTORE_ROOT_COLLECTION, RemoteStoreCookies } from 'libs/firebase/firestore/types'
import { doc, getDoc, getFirestore } from 'libs/firebase/shims/firestore'
import { captureMonitoringError } from 'libs/monitoring/errors'

import { getCookiesLastUpdate } from './getCookiesLastUpdate'

jest.mock('@react-native-firebase/firestore')
jest.mock('libs/monitoring/errors')
jest.mock('libs/firebase/shims/firestore')

const firestoreInstance = getFirestore()

const mockGet = getDoc as jest.Mock

const validFirebaseData = {
  lastUpdated: '2022-09-16',
  buildVersion: 10206000,
}

const mockCaptureMonitoringError = captureMonitoringError as jest.Mock

describe('[method] getCookiesLastUpdate', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  beforeAll(() =>
    doc(firestoreInstance, FIRESTORE_ROOT_COLLECTION, RemoteStoreCookies.COOKIES_LAST_UPDATE_DATE)
  )

  it('should call the right path: cookiesLastUpdate', async () => {
    mockGet.mockResolvedValueOnce({ get: jest.fn() })

    await getCookiesLastUpdate()

    expect(doc).toHaveBeenCalledWith({}, 'root', 'cookiesLastUpdate')
  })

  it('should convert data: lastUpdated -> Date', async () => {
    const mockSnapshotGet = jest
      .fn()
      .mockReturnValueOnce(validFirebaseData.lastUpdated)
      .mockReturnValueOnce(validFirebaseData.buildVersion)

    mockGet.mockResolvedValueOnce({
      exists: true,
      get: mockSnapshotGet,
    })

    const cookiesLastUpdate = await getCookiesLastUpdate()

    expect(cookiesLastUpdate).toStrictEqual({
      lastUpdated: new Date(validFirebaseData.lastUpdated),
      lastUpdateBuildVersion: validFirebaseData.buildVersion,
    })
  })

  it('should return undefined when data is not defined', async () => {
    const mockSnapshotGet = jest.fn().mockReturnValueOnce(undefined).mockReturnValueOnce(undefined)

    mockGet.mockResolvedValueOnce({
      exists: true,
      get: mockSnapshotGet,
    })

    const cookiesLastUpdate = await getCookiesLastUpdate()

    expect(cookiesLastUpdate).toBeUndefined()
  })

  it('should log error when firestore cannot retrieve collection', async () => {
    mockGet.mockRejectedValueOnce(new Error('ERROR'))

    await getCookiesLastUpdate()

    expect(mockCaptureMonitoringError).toHaveBeenCalledWith('ERROR', 'firestore_not_available')
  })

  it.each(['', 'abc', '22-09-16', undefined])(
    'should return undefined when last update date is invalid: %s',
    async (lastUpdated) => {
      const mockSnapshotGet = jest
        .fn()
        .mockReturnValueOnce(lastUpdated)
        .mockReturnValueOnce(validFirebaseData.buildVersion)

      mockGet.mockResolvedValueOnce({
        exists: true,
        get: mockSnapshotGet,
      })

      const cookiesLastUpdate = await getCookiesLastUpdate()

      expect(cookiesLastUpdate).toBeUndefined()
    }
  )
})
