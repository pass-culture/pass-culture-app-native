// eslint-disable-next-line no-restricted-imports
import { fetch } from '@react-native-community/netinfo'

import { firestoreRemoteStore } from 'libs/firebase/firestore/client'
import firestore from 'libs/firebase/shims/firestore'
import { captureMonitoringError } from 'libs/monitoring'

import { getCookiesLastUpdate } from './getCookiesLastUpdate'

jest.mock('@react-native-firebase/firestore')
jest.mock('libs/monitoring')

const { collection } = firestore()

const validFirebaseData = {
  lastUpdated: '2022-09-16',
  buildVersion: 10206000,
}

const mockGet = jest.fn()
const mockFetch = fetch as jest.Mock
const mockCaptureMonitoringError = captureMonitoringError as jest.Mock

const mockFirestoreDocumentGet = collection('cookiesLastUpdate').doc('testing').get as jest.Mock

describe('[method] getCookiesLastUpdate', () => {
  beforeAll(() =>
    mockFirestoreDocumentGet.mockResolvedValue({
      get: mockGet,
    })
  )

  it('should call the right path: cookiesLastUpdate', async () => {
    await getCookiesLastUpdate()

    expect(collection).toHaveBeenCalledWith('cookiesLastUpdate')
  })

  it('should convert data: lastUpdated -> Date', async () => {
    mockGet
      .mockReturnValueOnce(validFirebaseData.lastUpdated)
      .mockReturnValueOnce(validFirebaseData.buildVersion)

    const cookiesLastUpdate = await getCookiesLastUpdate()

    expect(cookiesLastUpdate).toStrictEqual({
      lastUpdated: new Date(validFirebaseData.lastUpdated),
      lastUpdateBuildVersion: validFirebaseData.buildVersion,
    })
  })

  it('should return undefined when data is not defined', async () => {
    mockGet.mockReturnValueOnce(undefined).mockReturnValueOnce(undefined)

    const cookiesLastUpdate = await getCookiesLastUpdate()

    expect(cookiesLastUpdate).toBeUndefined()
  })

  it('should inform firestore to fetch data from its cache when internet is not reachable', async () => {
    mockFetch.mockResolvedValueOnce({
      isConnected: true,
      isInternetReachable: false,
      type: 'cellular',
    })

    await getCookiesLastUpdate()

    expect(firestoreRemoteStore.disableNetwork).toHaveBeenCalledWith()
  })

  it('should inform firestore to fetch data from server when internet is reachable', async () => {
    await getCookiesLastUpdate()

    expect(firestoreRemoteStore.enableNetwork).toHaveBeenCalledWith()
  })

  it('should log error when firestore cannot retrieve collection', async () => {
    mockFirestoreDocumentGet.mockRejectedValueOnce({
      message: 'ERROR',
    })

    await getCookiesLastUpdate()

    expect(mockCaptureMonitoringError).toHaveBeenCalledWith('ERROR', 'firestore_not_available')
  })

  it.each(['', 'abc', '22-09-16', undefined])(
    'should return undefined when last update date is invalid',
    async (lastUpdated) => {
      mockGet.mockReturnValueOnce(lastUpdated).mockReturnValueOnce(validFirebaseData.buildVersion)
      const cookiesLastUpdate = await getCookiesLastUpdate()

      expect(cookiesLastUpdate).toBeUndefined()
    }
  )
})
