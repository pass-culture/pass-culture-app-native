/* eslint-disable local-rules/no-currency-symbols */
import { CurrencyEnum } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
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
  const enablePacificFrancCurrency = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY
  )

  const { user } = useAuthContext()
  const isUserInPacificFrancRegion = user?.currency === CurrencyEnum.XPF
  const isUserInEuroRegion = user?.currency === CurrencyEnum.EUR

  const { selectedPlace } = useLocation()
  const isNewCaledonianLocationSelected = selectedPlace?.info === 'Nouvelle-Calédonie'

  if (isUserInEuroRegion) {
    return Currency.EURO
  }

  const showPacificFrancCurrency = isUserInPacificFrancRegion || isNewCaledonianLocationSelected
  if (enablePacificFrancCurrency && showPacificFrancCurrency) {
    return displayFormat === 'full' ? Currency.PACIFIC_FRANC_FULL : Currency.PACIFIC_FRANC_SHORT
  }

  return Currency.EURO
}
