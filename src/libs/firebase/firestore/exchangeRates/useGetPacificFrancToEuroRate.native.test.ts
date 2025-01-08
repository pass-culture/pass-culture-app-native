import { onlineManager } from 'react-query'

import { getExchangeRates } from 'libs/firebase/firestore/exchangeRates/getExchangeRates'
import {
  DEFAULT_PACIFIC_FRANC_TO_EURO_RATE,
  useGetPacificFrancToEuroRate,
} from 'libs/firebase/firestore/exchangeRates/useGetPacificFrancToEuroRate'
import { renderHook } from 'tests/utils'

jest.mock('@react-native-firebase/firestore')
jest.mock('libs/firebase/firestore/exchangeRates/getExchangeRates')
const mockGetExchangeRates = getExchangeRates as jest.Mock

describe('useGetPacificFrancToEuroRate', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with the default rate', () => {
    mockGetExchangeRates.mockImplementationOnce(() => jest.fn())
    const { result } = renderHook(() => useGetPacificFrancToEuroRate())

    expect(result.current).toBe(DEFAULT_PACIFIC_FRANC_TO_EURO_RATE)
  })

  it('should return remote exchange rate from firestore', () => {
    mockGetExchangeRates.mockImplementationOnce((pacificFrancToEuroRate) => {
      pacificFrancToEuroRate(0.05)
      return jest.fn()
    })

    const { result } = renderHook(() => useGetPacificFrancToEuroRate())

    expect(result.current).toBe(0.05)
  })

  it('should return default rate when connection is disabled', () => {
    onlineManager.setOnline(false)
    mockGetExchangeRates.mockImplementationOnce((pacificFrancToEuroRate) => {
      pacificFrancToEuroRate(0.05)
      return jest.fn()
    })

    const { result } = renderHook(() => useGetPacificFrancToEuroRate())

    expect(result.current).toBe(DEFAULT_PACIFIC_FRANC_TO_EURO_RATE)
  })
})
