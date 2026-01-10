import { useGetPacificFrancToEuroRate } from 'queries/settings/useSettings'
import { DEFAULT_PACIFIC_FRANC_TO_EURO_RATE } from 'shared/exchangeRates/defaultRateValues'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { setSettingsMock } from 'tests/settings/mockSettings'
import { act, renderHook } from 'tests/utils'

describe('useSettings', () => {
  describe('useGetPacificFrancToEuroRate', () => {
    const renderUseGetPacificFrancToEuroRate = () =>
      renderHook(useGetPacificFrancToEuroRate, {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should return default rate when data are not yet available', async () => {
      setSettingsMock({ rates: undefined })
      const { result } = renderUseGetPacificFrancToEuroRate()

      await act(async () => {})

      expect(result.current.data).toEqual(DEFAULT_PACIFIC_FRANC_TO_EURO_RATE)
    })

    it('should return exchange rate from backend', async () => {
      setSettingsMock({ rates: { pacificFrancToEuro: 0.05 } })
      const { result } = renderUseGetPacificFrancToEuroRate()

      await act(async () => {})

      expect(result.current.data).toEqual(0.05)
    })
  })
})
