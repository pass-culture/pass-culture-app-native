import { defaultSettings } from 'features/auth/fixtures/fixtures'
import { DEFAULT_PACIFIC_FRANC_TO_EURO_RATE } from 'shared/exchangeRates/defaultRateValues'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

const mockSettings = jest.fn().mockReturnValue({ data: defaultSettings })
jest.mock('features/auth/context/SettingsContext', () => ({
  useSettingsContext: jest.fn(() => mockSettings()),
}))

describe('useGetPacificFrancToEuroRate', () => {
  beforeEach(() => jest.clearAllMocks())

  it('should initialize with the default rate', async () => {
    mockSettings.mockReturnValueOnce({ data: undefined })
    const { result } = renderUseGetPacificFrancToEuroRate()

    await act(async () => {})

    expect(result.current).toEqual(DEFAULT_PACIFIC_FRANC_TO_EURO_RATE)
  })

  it('should return exchange rate from backend', async () => {
    mockSettings.mockReturnValueOnce({
      data: { ...defaultSettings, rates: { pacificFrancToEuro: 0.05 } },
    })
    const { result } = renderUseGetPacificFrancToEuroRate()

    await act(async () => {})

    expect(result.current).toEqual(0.05)
  })
})

const renderUseGetPacificFrancToEuroRate = () =>
  renderHook(useGetPacificFrancToEuroRate, {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
