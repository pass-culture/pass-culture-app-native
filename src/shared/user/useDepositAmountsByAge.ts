import { useSettingsContext } from 'features/auth/context/SettingsContext'
import { useFormatCurrencyFromCents } from 'libs/parsers/formatCurrencyFromCents'

export function useDepositAmountsByAge() {
  const { data: settings } = useSettingsContext()
  const fifteenYearsOldAmount = settings?.depositAmountsByAge?.age_15 ?? 2000
  const sixteenYearsOldAmount = settings?.depositAmountsByAge?.age_16 ?? 3000
  const seventeenYearsOldAmount = settings?.depositAmountsByAge?.age_17 ?? 3000
  const eighteenYearsOldAmount = settings?.depositAmountsByAge?.age_18 ?? 30000

  const amountsByAge = {
    fifteenYearsOldDeposit: useFormatCurrencyFromCents(fifteenYearsOldAmount),
    sixteenYearsOldDeposit: useFormatCurrencyFromCents(sixteenYearsOldAmount),
    seventeenYearsOldDeposit: useFormatCurrencyFromCents(seventeenYearsOldAmount),
    eighteenYearsOldDeposit: useFormatCurrencyFromCents(eighteenYearsOldAmount),
  }
  return { ...amountsByAge }
}
