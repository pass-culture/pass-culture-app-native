import { useSettingsContext } from 'features/auth/context/SettingsContext'
import { useGetPacificFrancToEuroRate } from 'libs/firebase/firestore/exchangeRates/useGetPacificFrancToEuroRate'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'

export function useDepositAmountsByAge() {
  const { data: settings } = useSettingsContext()
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()

  const fifteenYearsOldAmount = settings?.depositAmountsByAge?.age_15 ?? 2000
  const sixteenYearsOldAmount = settings?.depositAmountsByAge?.age_16 ?? 3000
  const seventeenYearsOldAmount = settings?.depositAmountsByAge?.age_17 ?? 3000
  const eighteenYearsOldAmount = settings?.depositAmountsByAge?.age_18 ?? 30000

  const amountsByAge = {
    fifteenYearsOldDeposit: formatCurrencyFromCents(
      fifteenYearsOldAmount,
      currency,
      euroToPacificFrancRate
    ),
    sixteenYearsOldDeposit: formatCurrencyFromCents(
      sixteenYearsOldAmount,
      currency,
      euroToPacificFrancRate
    ),
    seventeenYearsOldDeposit: formatCurrencyFromCents(
      seventeenYearsOldAmount,
      currency,
      euroToPacificFrancRate
    ),
    eighteenYearsOldDeposit: formatCurrencyFromCents(
      eighteenYearsOldAmount,
      currency,
      euroToPacificFrancRate
    ),
  }
  return { ...amountsByAge }
}
