import { useSettingsContext } from 'features/auth/context/SettingsContext'

export const DEFAULT_PACIFIC_FRANC_TO_EURO_RATE = 0.00838

export const useGetPacificFrancToEuroRate = (): number => {
  const { data: settings } = useSettingsContext()
  return settings?.rates?.pacificFrancToEuro ?? DEFAULT_PACIFIC_FRANC_TO_EURO_RATE
}
