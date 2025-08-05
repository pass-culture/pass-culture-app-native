import { CurrencyEnum } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useGetStepperInfoQuery } from 'features/identityCheck/queries/useGetStepperInfoQuery'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags as featureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { useGetDepositAmountsByAge } from 'shared/user/useGetDepositAmountsByAge'

export function useOverrideCreditActivationAmount() {
  const enablePacificFrancCurrency = useFeatureFlag(featureFlags.ENABLE_PACIFIC_FRANC_CURRENCY)
  const { user } = useAuthContext()
  const { selectedLocationMode } = useLocation()
  const { data: subscription } = useGetStepperInfoQuery()

  const amount = useGetDepositAmountsByAge(user?.birthDate)

  const nextSubscriptionStepEnable = !!subscription?.nextSubscriptionStep
  const isEligibleForBeneficiaryUpgrade = !!user?.isEligibleForBeneficiaryUpgrade
  const isActivationProcessEnable = nextSubscriptionStepEnable || isEligibleForBeneficiaryUpgrade

  const isUserLocated = selectedLocationMode !== LocationMode.EVERYWHERE
  const isUserRegisteredInPacificFrancRegion = user?.currency === CurrencyEnum.XPF
  const isUserInRelevantLocation = isUserLocated || isUserRegisteredInPacificFrancRegion

  if (enablePacificFrancCurrency) {
    if (isActivationProcessEnable || isUserInRelevantLocation) {
      return { shouldBeOverriden: true, amount }
    }
  }
  return { shouldBeOverriden: false, amount }
}
