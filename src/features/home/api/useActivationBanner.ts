import { CurrencyEnum } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useBannerQuery } from 'features/home/queries/useBannerQuery'
import { useGetStepperInfoQuery } from 'features/identityCheck/queries/useGetStepperInfoQuery'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags as featureFlags } from 'libs/firebase/firestore/types'
import { GeolocPermissionState, useLocation } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { useGetDepositAmountsByAge } from 'shared/user/useGetDepositAmountsByAge'

export function useActivationBanner() {
  const enablePacificFrancCurrency = useFeatureFlag(featureFlags.ENABLE_PACIFIC_FRANC_CURRENCY)
  const { user } = useAuthContext()
  const { selectedLocationMode, permissionState } = useLocation()
  const { data: subscription } = useGetStepperInfoQuery()

  const amount = useGetDepositAmountsByAge(user?.birthDate)

  const nextSubscriptionStepEnable = !!subscription?.nextSubscriptionStep
  const isEligibleForBeneficiaryUpgrade = !!user?.isEligibleForBeneficiaryUpgrade
  const isActivationProcessEnable = nextSubscriptionStepEnable || isEligibleForBeneficiaryUpgrade

  const isUserLocated = selectedLocationMode !== LocationMode.EVERYWHERE
  const isUserRegisteredInPacificFrancRegion = user?.currency === CurrencyEnum.XPF
  const isUserInRelevantLocation = isUserLocated || isUserRegisteredInPacificFrancRegion

  const isGeolocated = permissionState === GeolocPermissionState.GRANTED
  const { data } = useBannerQuery(isGeolocated)

  if (enablePacificFrancCurrency) {
    if (isActivationProcessEnable || isUserInRelevantLocation) {
      return {
        banner: {
          title: amount ? `Débloque tes ${amount}` : 'Débloque ton crédit',
          text: data?.banner?.text,
          name: data?.banner?.name,
        },
      }
    }
  }
  return { banner: { ...data?.banner } }
}
