/* eslint-disable local-rules/no-currency-symbols */
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/location'

enum Currency {
  EURO = '€',
  PACIFIC_FRANC_SHORT = 'F',
  PACIFIC_FRANC_FULL = 'francs\u00a0Pacifique',
}

type CurrencyDisplayFormat = 'short' | 'full'

export const useGetCurrencyToDisplay = (
  displayFormat: CurrencyDisplayFormat = 'short'
): Currency => {
  const { selectedPlace } = useLocation()
  const isNewCaledonianLocation = selectedPlace?.info === 'Nouvelle-Calédonie'
  const enablePacificFrancCurrency = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY
  )

  if (isNewCaledonianLocation && enablePacificFrancCurrency) {
    return displayFormat === 'full' ? Currency.PACIFIC_FRANC_FULL : Currency.PACIFIC_FRANC_SHORT
  }
  return Currency.EURO
}
