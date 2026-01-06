import { SettingsResponse } from 'api/gen'
import { useSettingsQuery } from 'queries/settings/useSettingsQuery'
import { DEFAULT_PACIFIC_FRANC_TO_EURO_RATE } from 'shared/exchangeRates/defaultRateValues'

const selectPacificFrancToEuro = (settings: SettingsResponse) => settings.rates?.pacificFrancToEuro

export const useGetPacificFrancToEuroRate = (): number => {
  const { data: pacificFrancToEuro } = useSettingsQuery({
    select: selectPacificFrancToEuro,
  })
  return pacificFrancToEuro ?? DEFAULT_PACIFIC_FRANC_TO_EURO_RATE
}
