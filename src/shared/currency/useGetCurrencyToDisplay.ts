import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/location'

enum Currency {
  EURO = '€',
  PACIFIC_FRANC = 'F',
}

export const useGetCurrencyToDisplay = (): Currency => {
  const { selectedPlace } = useLocation()
  const isNewCaledonianLocation = selectedPlace?.info === 'Nouvelle-Calédonie'
  const enablePacificFrancCurrency = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY
  )

  if (isNewCaledonianLocation && enablePacificFrancCurrency) return Currency.PACIFIC_FRANC
  return Currency.EURO
}
