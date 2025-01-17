import { DepositAmountsByAge } from 'api/gen'
import { useSettingsContext } from 'features/auth/context/SettingsContext'
import {
  DEFAULT_FIFTEEN_YEARS_OLD_AMOUNT_V2,
  DEFAULT_SIXTEEN_YEARS_OLD_AMOUNT_V2,
  DEFAULT_SEVENTEEN_YEARS_OLD_AMOUNT_V2,
  DEFAULT_EIGHTEEN_YEARS_OLD_AMOUNT_V2,
  DEFAULT_FIFTEEN_YEARS_OLD_AMOUNT_V3,
  DEFAULT_SIXTEEN_YEARS_OLD_AMOUNT_V3,
  DEFAULT_SEVENTEEN_YEARS_OLD_AMOUNT_V3,
  DEFAULT_EIGHTEEN_YEARS_OLD_AMOUNT_V3,
} from 'shared/credits/defaultCredits'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'

export function useDepositAmountsByAge() {
  const { data: settings } = useSettingsContext()
  const enableCreditV3 = settings?.wipEnableCreditV3
  const deposit = settings?.depositAmountsByAge

  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()

  const getDefaultAmountByAge = (
    ageKey: keyof DepositAmountsByAge,
    defaultV2: number,
    defaultV3: number
  ): number => {
    return deposit?.[ageKey] ?? (enableCreditV3 ? defaultV3 : defaultV2)
  }

  const amountsByAge = {
    fifteenYearsOldDeposit: formatCurrencyFromCents(
      getDefaultAmountByAge(
        'age_15',
        DEFAULT_FIFTEEN_YEARS_OLD_AMOUNT_V2,
        DEFAULT_FIFTEEN_YEARS_OLD_AMOUNT_V3
      ),
      currency,
      euroToPacificFrancRate
    ),
    sixteenYearsOldDeposit: formatCurrencyFromCents(
      getDefaultAmountByAge(
        'age_16',
        DEFAULT_SIXTEEN_YEARS_OLD_AMOUNT_V2,
        DEFAULT_SIXTEEN_YEARS_OLD_AMOUNT_V3
      ),
      currency,
      euroToPacificFrancRate
    ),
    seventeenYearsOldDeposit: formatCurrencyFromCents(
      getDefaultAmountByAge(
        'age_17',
        DEFAULT_SEVENTEEN_YEARS_OLD_AMOUNT_V2,
        DEFAULT_SEVENTEEN_YEARS_OLD_AMOUNT_V3
      ),
      currency,
      euroToPacificFrancRate
    ),
    eighteenYearsOldDeposit: formatCurrencyFromCents(
      getDefaultAmountByAge(
        'age_18',
        DEFAULT_EIGHTEEN_YEARS_OLD_AMOUNT_V2,
        DEFAULT_EIGHTEEN_YEARS_OLD_AMOUNT_V3
      ),
      currency,
      euroToPacificFrancRate
    ),
  }

  return amountsByAge
}
