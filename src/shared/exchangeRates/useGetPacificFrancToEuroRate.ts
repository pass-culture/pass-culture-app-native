import { useSettingsContext } from 'features/auth/context/SettingsContext'
import { DEFAULT_PACIFIC_FRANC_TO_EURO_RATE } from 'shared/exchangeRates/defaultRateValues'

export const useGetPacificFrancToEuroRate = (): number => {
  const { data: settings } = useSettingsContext()
  return settings?.rates?.pacificFrancToEuro ?? DEFAULT_PACIFIC_FRANC_TO_EURO_RATE
}
