import { setSettings } from 'features/auth/tests/setSettings'
import { DEFAULT_PACIFIC_FRANC_TO_EURO_RATE } from 'shared/exchangeRates/defaultRateValues'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

describe('useGetPacificFrancToEuroRate', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    setSettings()
  })

  it('should initialize with the default rate', async () => {
    const { result } = renderUseGetPacificFrancToEuroRate()

    await act(async () => {})

    expect(result.current).toEqual(DEFAULT_PACIFIC_FRANC_TO_EURO_RATE)
  })

  it('should return exchange rate from backend', async () => {
    setSettings({ rates: { pacificFrancToEuro: 0.05 } })
    const { result } = renderUseGetPacificFrancToEuroRate()

    await act(async () => {})

    expect(result.current).toEqual(0.05)
  })
})

const renderUseGetPacificFrancToEuroRate = () =>
  renderHook(useGetPacificFrancToEuroRate, {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
