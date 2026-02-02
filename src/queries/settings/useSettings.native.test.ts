import {
  useBonificationBonusAmount,
  useDepositAmountsByAge,
  usePacificFrancToEuroRate,
} from 'queries/settings/useSettings'
import {
  bonificationAmountFallbackValue,
  defaultCreditByAge,
} from 'shared/credits/defaultCreditByAge'
import { DEFAULT_PACIFIC_FRANC_TO_EURO_RATE } from 'shared/exchangeRates/defaultRateValues'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { setSettingsMock } from 'tests/settings/mockSettings'
import { act, renderHook } from 'tests/utils'

describe('useSettings', () => {
  describe('usePacificFrancToEuroRate', () => {
    const renderUsePacificFrancToEuroRate = () =>
      renderHook(usePacificFrancToEuroRate, {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should return default rate when data are not yet available', async () => {
      setSettingsMock({ areSettingsUndefined: true })
      const { result } = renderUsePacificFrancToEuroRate()

      await act(async () => {})

      expect(result.current.data).toEqual(DEFAULT_PACIFIC_FRANC_TO_EURO_RATE)
    })

    it('should return exchange rate from backend', async () => {
      setSettingsMock({ patchSettingsWith: { rates: { pacificFrancToEuro: 0.05 } } })
      const { result } = renderUsePacificFrancToEuroRate()

      await act(async () => {})

      expect(result.current.data).toEqual(0.05)
    })
  })

  describe('useDepositAmountsByAge', () => {
    const renderUseDepositAmountsByAge = () =>
      renderHook(useDepositAmountsByAge, {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should return default deposit amount by age when data are not available', async () => {
      setSettingsMock({ areSettingsUndefined: true })
      const { result } = renderUseDepositAmountsByAge()

      await act(async () => {})

      expect(result.current.data).toEqual(defaultCreditByAge)
    })

    it('should return deposit amount by age from backend', async () => {
      const depositAmountsByAgeData = { age_15: 1000, age_16: 2000, age_17: 3000, age_18: 4000 }
      setSettingsMock({ patchSettingsWith: { depositAmountsByAge: depositAmountsByAgeData } })
      const { result } = renderUseDepositAmountsByAge()

      await act(async () => {})

      expect(result.current.data).toEqual(depositAmountsByAgeData)
    })
  })

  describe('useBonificationBonusAmount', () => {
    const renderUseBonificationBonusAmount = () =>
      renderHook(useBonificationBonusAmount, {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should return default bonification amount when data are not available', async () => {
      setSettingsMock({ areSettingsUndefined: true })
      const { result } = renderUseBonificationBonusAmount()

      await act(async () => {})

      expect(result.current.data).toEqual(bonificationAmountFallbackValue)
    })

    it('should return bonification amount from backend', async () => {
      setSettingsMock({
        patchSettingsWith: { bonification: { bonusAmount: 50, qfThreshold: 1000 } },
      })
      const { result } = renderUseBonificationBonusAmount()

      await act(async () => {})

      expect(result.current.data).toEqual(50)
    })
  })
})
