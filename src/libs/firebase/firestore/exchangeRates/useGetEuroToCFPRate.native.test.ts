import { getExchangeRates } from 'libs/firebase/firestore/exchangeRates/getExchangeRates'
import {
  DEFAULT_EURO_TO_CFP_RATE,
  useGetEuroToCFPRate,
} from 'libs/firebase/firestore/exchangeRates/useGetEuroToCFPRate'
import { renderHook } from 'tests/utils'

jest.mock('@react-native-firebase/firestore')
jest.mock('libs/firebase/firestore/exchangeRates/getExchangeRates')
const mockGetExchangeRates = getExchangeRates as jest.Mock

describe('useGetEuroToCFPRate', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with the default rate', () => {
    mockGetExchangeRates.mockImplementationOnce(() => jest.fn())
    const { result } = renderHook(() => useGetEuroToCFPRate())

    expect(result.current).toBe(DEFAULT_EURO_TO_CFP_RATE)
  })

  it('should return remote exchange rate from firestore', () => {
    mockGetExchangeRates.mockImplementationOnce((euroToCFPRate) => {
      euroToCFPRate(120)
      return jest.fn()
    })

    const { result } = renderHook(() => useGetEuroToCFPRate())

    expect(result.current).toBe(120)
  })
})
