import { selectPacificFrancToEuro } from 'queries/settings/settingsSelectors'
import { useSettingsQuery } from 'queries/settings/useSettingsQuery'
import { DEFAULT_PACIFIC_FRANC_TO_EURO_RATE } from 'shared/exchangeRates/defaultRateValues'

export const useGetPacificFrancToEuroRate = (): number => {
  const { data: pacificFrancToEuro } = useSettingsQuery({
    select: selectPacificFrancToEuro,
  })
  return pacificFrancToEuro ?? DEFAULT_PACIFIC_FRANC_TO_EURO_RATE
}
