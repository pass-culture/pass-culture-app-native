import { CurrencyEnum } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useBanner } from 'features/home/api/useBanner'
import { useGetStepperInfo } from 'features/identityCheck/api/useGetStepperInfo'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags as featureFlags } from 'libs/firebase/firestore/types'
import { GeolocPermissionState, useLocation } from 'libs/location'
import { LocationMode } from 'libs/location/types'

export function useActivationBanner() {
  const enablePacificFrancCurrency = useFeatureFlag(featureFlags.ENABLE_PACIFIC_FRANC_CURRENCY)
  const { user } = useAuthContext()
  const { selectedLocationMode, permissionState } = useLocation()
  const { data: subscription } = useGetStepperInfo()

  const nextSubscriptionStepEnable = !!subscription?.nextSubscriptionStep
  const isEligibleForBeneficiaryUpgrade = !!user?.isEligibleForBeneficiaryUpgrade
  const isActivationProcessEnable = nextSubscriptionStepEnable || isEligibleForBeneficiaryUpgrade

  const isUserLocated = selectedLocationMode !== LocationMode.EVERYWHERE
  const isUserRegisteredInPacificFrancRegion = user?.currency === CurrencyEnum.XPF
  const isUserInRelevantLocation = isUserLocated || isUserRegisteredInPacificFrancRegion

  const isGeolocated = permissionState === GeolocPermissionState.GRANTED
  const { data } = useBanner(isGeolocated)

  if (enablePacificFrancCurrency) {
    if (isActivationProcessEnable || isUserInRelevantLocation) {
      return {
        banner: {
          title: data?.banner?.title,
          text: data?.banner?.text,
          name: data?.banner?.name,
        },
      }
    }
  }
  return { banner: { ...data?.banner } }
}
