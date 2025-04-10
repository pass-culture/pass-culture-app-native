import { DepositAmountsByAge } from 'api/gen'
import { useSettingsContext } from 'features/auth/context/SettingsContext'
import { defaultCreditByAge } from 'shared/credits/defaultCreditByAge'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'

export function useDepositAmountsByAge() {
  const { data: settings } = useSettingsContext()
  const deposit = settings?.depositAmountsByAge

  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()

  const getDefaultAmountByAge = (ageKey: keyof DepositAmountsByAge): number => {
    return deposit?.[ageKey] ?? defaultCreditByAge[ageKey]
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
