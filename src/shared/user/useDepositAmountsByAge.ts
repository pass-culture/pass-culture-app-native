import { useSettingsContext } from 'features/auth/context/SettingsContext'
import { parseCurrencyFromCents } from 'libs/parsers/getDisplayPrice'

export function useDepositAmountsByAge() {
  const { data: settings } = useSettingsContext()
  const fifteenYearsOldAmount = settings?.depositAmountsByAge?.age_15 ?? 2000
  const sixteenYearsOldAmount = settings?.depositAmountsByAge?.age_16 ?? 3000
  const seventeenYearsOldAmount = settings?.depositAmountsByAge?.age_17 ?? 3000
  const eighteenYearsOldAmount = settings?.depositAmountsByAge?.age_18 ?? 30000

  const amountsByAge = {
    fifteenYearsOldDeposit: parseCurrencyFromCents(fifteenYearsOldAmount),
    sixteenYearsOldDeposit: parseCurrencyFromCents(sixteenYearsOldAmount),
    seventeenYearsOldDeposit: parseCurrencyFromCents(seventeenYearsOldAmount),
    eighteenYearsOldDeposit: parseCurrencyFromCents(eighteenYearsOldAmount),
  }
  return { ...amountsByAge }
}
