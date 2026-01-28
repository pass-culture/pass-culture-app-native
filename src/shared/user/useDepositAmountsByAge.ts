import { DepositAmountsByAge } from 'api/gen'
import {
  useGetPacificFrancToEuroRate,
  useDepositAmountsByAge as useDepositAmountsByAgeSetting,
} from 'queries/settings/useSettings'
import { defaultCreditByAge } from 'shared/credits/defaultCreditByAge'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'

export function useDepositAmountsByAge() {
  const { data: depositAmountsByAge } = useDepositAmountsByAgeSetting()

  const currency = useGetCurrencyToDisplay()
  const { data: euroToPacificFrancRate } = useGetPacificFrancToEuroRate()

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
