import { useSettingsContext } from 'features/auth/context/SettingsContext'
import { formatToFrenchDecimal } from 'libs/parsers/getDisplayPrice'
import { useGetCurrentCurrency } from 'libs/parsers/useGetCurrentCurrency'
import { useGetEuroToXPFRate } from 'libs/parsers/useGetEuroToXPFRate'

export function useDepositAmountsByAge() {
  const currency = useGetCurrentCurrency()
  const euroToXPFRate = useGetEuroToXPFRate()

  const { data: settings } = useSettingsContext()
  const fifteenYearsOldAmount = settings?.depositAmountsByAge?.age_15 ?? 2000
  const sixteenYearsOldAmount = settings?.depositAmountsByAge?.age_16 ?? 3000
  const seventeenYearsOldAmount = settings?.depositAmountsByAge?.age_17 ?? 3000
  const eighteenYearsOldAmount = settings?.depositAmountsByAge?.age_18 ?? 30000

  const amountsByAge = {
    fifteenYearsOldDeposit: formatToFrenchDecimal(fifteenYearsOldAmount, currency, euroToXPFRate),
    sixteenYearsOldDeposit: formatToFrenchDecimal(sixteenYearsOldAmount, currency, euroToXPFRate),
    seventeenYearsOldDeposit: formatToFrenchDecimal(
      seventeenYearsOldAmount,
      currency,
      euroToXPFRate
    ),
    eighteenYearsOldDeposit: formatToFrenchDecimal(eighteenYearsOldAmount, currency, euroToXPFRate),
  }
  return { ...amountsByAge }
}
