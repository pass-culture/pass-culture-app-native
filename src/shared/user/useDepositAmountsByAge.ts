import {
  usePacificFrancToEuroRate,
  useDepositAmountsByAge as useDepositAmountsByAgeSetting,
} from 'queries/settings/useSettings'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'

export function useDepositAmountsByAge() {
  const { data: depositAmountsByAge } = useDepositAmountsByAgeSetting()

  const currency = useGetCurrencyToDisplay()
  const { data: euroToPacificFrancRate } = usePacificFrancToEuroRate()

  const amountsByAge = {
    fifteenYearsOldDeposit: formatCurrencyFromCents(
      depositAmountsByAge['age_15'],
      currency,
      euroToPacificFrancRate
    ),
    sixteenYearsOldDeposit: formatCurrencyFromCents(
      depositAmountsByAge['age_16'],
      currency,
      euroToPacificFrancRate
    ),
    seventeenYearsOldDeposit: formatCurrencyFromCents(
      depositAmountsByAge['age_17'],
      currency,
      euroToPacificFrancRate
    ),
    eighteenYearsOldDeposit: formatCurrencyFromCents(
      depositAmountsByAge['age_18'],
      currency,
      euroToPacificFrancRate
    ),
  }

  return amountsByAge
}
