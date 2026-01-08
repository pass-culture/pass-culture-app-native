import { DepositAmountsByAge } from 'api/gen'
import { useSettingsQuery } from 'queries/settings/settingsQuery'
import { selectDepositAmountsByAge } from 'queries/settings/settingsSelectors'
import { defaultCreditByAge } from 'shared/credits/defaultCreditByAge'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'

export function useDepositAmountsByAge() {
  const { data: depositAmountsByAge } = useSettingsQuery({
    select: selectDepositAmountsByAge,
  })

  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()

  const getDefaultAmountByAge = (ageKey: keyof DepositAmountsByAge): number => {
    return depositAmountsByAge?.[ageKey] ?? defaultCreditByAge[ageKey]
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
