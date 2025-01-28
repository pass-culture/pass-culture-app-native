import { useSettings } from 'features/auth/context/useSettings'
import { DEFAULT_PACIFIC_FRANC_TO_EURO_RATE } from 'shared/exchangeRates/defaultRateValues'

export const useGetPacificFrancToEuroRate = (): number => {
  const { data: settings } = useSettings()
  return settings?.rates?.pacificFrancToEuro ?? DEFAULT_PACIFIC_FRANC_TO_EURO_RATE
}
