/* eslint-disable local-rules/no-currency-symbols */
import { RouteProp, useRoute } from '@react-navigation/native'

import { CurrencyEnum } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags as featureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/location/location'
import { LocationMode } from 'libs/location/types'

export enum Currency {
  EURO = '€',
  PACIFIC_FRANC_SHORT = 'F',
  PACIFIC_FRANC_FULL = 'francs\u00a0Pacifique',
}

type CurrencyDisplayFormat = 'short' | 'full'

export const useGetCurrencyToDisplay = (
  displayFormat: CurrencyDisplayFormat = 'short'
): Currency => {
  const route =
    useRoute<
      RouteProp<Record<string, { currency?: CurrencyEnum.EUR | CurrencyEnum.XPF }>, string>
    >()
  const currencyParam = route.params?.currency

  const enablePacificFrancCurrency = useFeatureFlag(featureFlags.ENABLE_PACIFIC_FRANC_CURRENCY)
  const disablePacificFrancCurrency = !enablePacificFrancCurrency

  const { user } = useAuthContext()
  const { selectedPlace, selectedLocationMode } = useLocation()

  const pacificFrancCurrency =
    displayFormat === 'full' ? Currency.PACIFIC_FRANC_FULL : Currency.PACIFIC_FRANC_SHORT

  if (currencyParam === CurrencyEnum.EUR) return Currency.EURO
  if (currencyParam === CurrencyEnum.XPF) return pacificFrancCurrency

  if (disablePacificFrancCurrency) return Currency.EURO

  const isEverywhereLocationMode = selectedLocationMode === LocationMode.EVERYWHERE
  const isNotNewCaledonianLocationSelected = selectedPlace?.info !== 'Nouvelle-Calédonie'
  const isNewCaledonianLocationSelected = selectedPlace?.info === 'Nouvelle-Calédonie'

  if (selectedPlace) {
    if (isEverywhereLocationMode) return Currency.EURO
    if (isNotNewCaledonianLocationSelected) return Currency.EURO
    if (isNewCaledonianLocationSelected) return pacificFrancCurrency
  }

  const isUserRegisteredInEuroRegion = user?.currency === CurrencyEnum.EUR
  const isUserRegisteredInPacificFrancRegion = user?.currency === CurrencyEnum.XPF

  if (user) {
    if (isUserRegisteredInEuroRegion) return Currency.EURO
    if (isUserRegisteredInPacificFrancRegion) return pacificFrancCurrency
  }

  if (isEverywhereLocationMode) return Currency.EURO

  return Currency.EURO
}
