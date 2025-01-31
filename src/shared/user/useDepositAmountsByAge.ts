import { DepositAmountsByAge } from 'api/gen'
import { useSettings } from 'features/auth/context/useSettings'
import { defaultCreditByAge } from 'shared/credits/defaultCreditByAge'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'

export function useDepositAmountsByAge() {
  const { data: settings } = useSettings()
  const enableCreditV3 = settings?.wipEnableCreditV3
  const deposit = settings?.depositAmountsByAge

  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()

  const getDefaultAmountByAge = (ageKey: keyof DepositAmountsByAge): number => {
    const version = enableCreditV3 ? 'v3' : 'v2'
    return deposit?.[ageKey] ?? defaultCreditByAge[version][ageKey]
  }

  const amountsByAge = {
    fifteenYearsOldDeposit: formatCurrencyFromCents(
      getDefaultAmountByAge('age_15'),
      currency,
      euroToPacificFrancRate
    ),
    sixteenYearsOldDeposit: formatCurrencyFromCents(
      getDefaultAmountByAge('age_16'),
      currency,
      euroToPacificFrancRate
    ),
    seventeenYearsOldDeposit: formatCurrencyFromCents(
      getDefaultAmountByAge('age_17'),
      currency,
      euroToPacificFrancRate
    ),
    eighteenYearsOldDeposit: formatCurrencyFromCents(
      getDefaultAmountByAge('age_18'),
      currency,
      euroToPacificFrancRate
    ),
  }

  return amountsByAge
}
