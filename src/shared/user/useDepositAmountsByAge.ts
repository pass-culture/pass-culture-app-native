import { useSettingsContext } from 'features/auth/context/SettingsContext'
import {
  DEFAULT_FIFTEEN_YEARS_OLD_AMOUNT,
  DEFAULT_SIXTEEN_YEARS_OLD_AMOUNT,
  DEFAULT_SEVENTEEN_YEARS_OLD_AMOUNT,
  DEFAULT_EIGHTEEN_YEARS_OLD_AMOUNT,
} from 'shared/credits/defaultCredits'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'

export function useDepositAmountsByAge() {
  const { data: settings } = useSettingsContext()
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()

  const fifteenYearsOldAmount =
    settings?.depositAmountsByAge?.age_15 ?? DEFAULT_FIFTEEN_YEARS_OLD_AMOUNT
  const sixteenYearsOldAmount =
    settings?.depositAmountsByAge?.age_16 ?? DEFAULT_SIXTEEN_YEARS_OLD_AMOUNT
  const seventeenYearsOldAmount =
    settings?.depositAmountsByAge?.age_17 ?? DEFAULT_SEVENTEEN_YEARS_OLD_AMOUNT
  const eighteenYearsOldAmount =
    settings?.depositAmountsByAge?.age_18 ?? DEFAULT_EIGHTEEN_YEARS_OLD_AMOUNT

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
