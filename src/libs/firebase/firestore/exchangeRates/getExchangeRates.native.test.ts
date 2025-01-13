import { FIRESTORE_ROOT_COLLECTION, RemoteStoreDocuments } from 'libs/firebase/firestore/types'
import firestore from 'libs/firebase/shims/firestore'
import { captureMonitoringError } from 'libs/monitoring'
import { waitFor } from 'tests/utils'

import { getExchangeRates } from './getExchangeRates'

jest.mock('@react-native-firebase/firestore')
jest.mock('libs/monitoring/errors')

const { collection } = firestore()
const { get } = collection(FIRESTORE_ROOT_COLLECTION).doc(RemoteStoreDocuments.EXCHANGE_RATES)
const mockGet = get as jest.Mock

describe('getExchangeRates', () => {
  it('should call the right firestore document "exchangeRates"', () => {
    getExchangeRates()

    expect(collection).toHaveBeenCalledWith('root')
    expect(collection('root').doc).toHaveBeenCalledWith(RemoteStoreDocuments.EXCHANGE_RATES)
  })

  it('should call captureMonitoringError when Firestore throws an error', async () => {
    mockGet.mockRejectedValueOnce(new Error('Firestore error'))
    getExchangeRates()

    await waitFor(() => {
      expect(captureMonitoringError).toHaveBeenCalledWith(
        'Firestore error',
        'firestore_not_available'
      )
    })
  })
})
