import { useSettingsQuery } from 'queries/settings/settingsQuery'
import { selectPacificFrancToEuro } from 'queries/settings/settingsSelectors'
import { DEFAULT_PACIFIC_FRANC_TO_EURO_RATE } from 'shared/exchangeRates/defaultRateValues'

export const useGetPacificFrancToEuroRate = (): number => {
  const { data: pacificFrancToEuro } = useSettingsQuery({
    select: selectPacificFrancToEuro,
  })
  return pacificFrancToEuro ?? DEFAULT_PACIFIC_FRANC_TO_EURO_RATE
}
