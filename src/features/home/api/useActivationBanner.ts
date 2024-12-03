import { UseQueryResult, useQuery } from 'react-query'

import { api } from 'api/api'
import { Banner, CurrencyEnum } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags as featureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'
import { useGetDepositAmountsByAge } from 'shared/user/useGetDepositAmountsByAge'

export function useActivationBanner(hasGeolocPosition: boolean): UseQueryResult<Banner> {
  const enablePacificFrancCurrency = useFeatureFlag(featureFlags.ENABLE_PACIFIC_FRANC_CURRENCY)
  const { isLoggedIn, user } = useAuthContext()
  const { selectedLocationMode } = useLocation()
  const netInfo = useNetInfoContext()
  const amount = useGetDepositAmountsByAge(user?.birthDate)
  const isLocated = selectedLocationMode !== LocationMode.EVERYWHERE
  const isUserRegisteredInPacificFrancRegion = user?.currency === CurrencyEnum.XPF

  const activationBannerTitle = (activationBannerTitleFromAPI?: string) => {
    if (enablePacificFrancCurrency) {
      if (isUserRegisteredInPacificFrancRegion || isLocated) {
        return amount ? `Débloque tes ${amount}` : 'Débloque ton crédit'
      }
    }
    return activationBannerTitleFromAPI
  }

  return useQuery(
    [
      QueryKeys.HOME_BANNER,
      hasGeolocPosition,
      isLocated,
      amount,
      isUserRegisteredInPacificFrancRegion,
    ],
    async () => {
      const data = await api.getNativeV1Banner(hasGeolocPosition)
      return { ...data.banner, title: activationBannerTitle(data.banner?.title) }
    },
    { enabled: !!netInfo.isConnected && isLoggedIn }
  )
}
