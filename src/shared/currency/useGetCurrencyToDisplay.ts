/* eslint-disable local-rules/no-currency-symbols */
import { CurrencyEnum } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags as featureFlags } from 'libs/firebase/firestore/types'
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
  const enablePacificFrancCurrency = useFeatureFlag(featureFlags.ENABLE_PACIFIC_FRANC_CURRENCY)
  const disablePacificFrancCurrency = !enablePacificFrancCurrency

  const { user } = useAuthContext()
  const isUserRegisteredInEuroRegion = user?.currency === CurrencyEnum.EUR
  const isUserRegisteredInPacificFrancRegion = user?.currency === CurrencyEnum.XPF

  const { selectedPlace } = useLocation()
  const isNewCaledonianLocationSelected = selectedPlace?.info === 'Nouvelle-Calédonie'
  const isNotNewCaledonianLocationSelected = !isNewCaledonianLocationSelected

  const pacificFrancCurrency =
    displayFormat === 'full' ? Currency.PACIFIC_FRANC_FULL : Currency.PACIFIC_FRANC_SHORT

  switch (true) {
    case disablePacificFrancCurrency:
    case isUserRegisteredInEuroRegion:
    case isNotNewCaledonianLocationSelected:
      return Currency.EURO
    case enablePacificFrancCurrency &&
      (isUserRegisteredInPacificFrancRegion || isNewCaledonianLocationSelected):
      return pacificFrancCurrency
    default:
      return Currency.EURO
  }
}
