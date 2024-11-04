import { FIRESTORE_ROOT_COLLECTION, RemoteStoreDocuments } from 'libs/firebase/firestore/types'
import firestore from 'libs/firebase/shims/firestore'
import { captureMonitoringError } from 'libs/monitoring'
import { waitFor } from 'tests/utils'

import { getExchangeRates } from './getExchangeRates'

jest.mock('@react-native-firebase/firestore')
jest.mock('libs/monitoring/errors')

const { doc } = firestore().collection(FIRESTORE_ROOT_COLLECTION)
const { onSnapshot } = doc(RemoteStoreDocuments.EXCHANGE_RATES)
const mockOnSnapshot = onSnapshot as jest.Mock

const MOCK_RATE_FROM_FIRESTORE = 120

describe('getExchangeRates', () => {
  let onRateChangeMock: jest.Mock<(euroToCFPRate: number) => void>

  beforeEach(() => {
    onRateChangeMock = jest.fn()
    jest.clearAllMocks()
  })

  it('should call the right firestore document "exchangeRates"', () => {
    getExchangeRates(onRateChangeMock)

    expect(doc).toHaveBeenCalledWith(RemoteStoreDocuments.EXCHANGE_RATES)
  })

  it('should call onRateChange with the euroToCFPRate value from Firestore', async () => {
    mockOnSnapshot.mockImplementationOnce((successCallback) => {
      successCallback({ get: () => MOCK_RATE_FROM_FIRESTORE })
    })

    getExchangeRates(onRateChangeMock)

    await waitFor(() => {
      expect(onRateChangeMock).toHaveBeenCalledWith(MOCK_RATE_FROM_FIRESTORE)
    })
  })

  it('should call captureMonitoringError when Firestore throws an error', async () => {
    const mockError = new Error('Firestore error')
    mockOnSnapshot.mockImplementationOnce((_, errorCallback) => {
      errorCallback(mockError)
    })

    getExchangeRates(onRateChangeMock)

    await waitFor(() => {
      expect(captureMonitoringError).toHaveBeenCalledWith(
        'Firestore error',
        'firestore_not_available'
      )
    })
  })
})
