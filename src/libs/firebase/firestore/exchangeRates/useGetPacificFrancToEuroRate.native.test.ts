import { onlineManager } from 'react-query'

import { getExchangeRates } from 'libs/firebase/firestore/exchangeRates/getExchangeRates'
import {
  DEFAULT_PACIFIC_FRANC_TO_EURO_RATE,
  useGetPacificFrancToEuroRate,
} from 'libs/firebase/firestore/exchangeRates/useGetPacificFrancToEuroRate'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook, waitFor } from 'tests/utils'

jest.mock('@react-native-firebase/firestore')
jest.mock('libs/firebase/firestore/exchangeRates/getExchangeRates')
const mockGetExchangeRates = getExchangeRates as jest.Mock

describe('useGetPacificFrancToEuroRate', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with the default rate', async () => {
    mockGetExchangeRates.mockReturnValueOnce(undefined)
    const { result } = renderUseGetPacificFrancToEuroRate()

    await act(() => {
      expect(result.current).toEqual(DEFAULT_PACIFIC_FRANC_TO_EURO_RATE)
    })
  })

  it('should return remote exchange rate from firestore', async () => {
    mockGetExchangeRates.mockReturnValueOnce(0.05)
    const { result } = renderUseGetPacificFrancToEuroRate()

    await waitFor(() => {
      expect(result.current).toEqual(0.05)
    })
  })

  it('should return default rate when connection is disabled', () => {
    onlineManager.setOnline(false)
    mockGetExchangeRates.mockReturnValueOnce(0.05)

    const { result } = renderUseGetPacificFrancToEuroRate()

    expect(result.current).toEqual(DEFAULT_PACIFIC_FRANC_TO_EURO_RATE)
  })
})

const renderUseGetPacificFrancToEuroRate = () =>
  renderHook(useGetPacificFrancToEuroRate, {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
