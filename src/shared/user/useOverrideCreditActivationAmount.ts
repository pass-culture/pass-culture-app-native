import { CurrencyEnum } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { getShouldDisplayActivationFlow } from 'features/auth/helpers/getShouldDisplayActivationFlow'
import { useGetStepperInfoQuery } from 'features/identityCheck/queries/useGetStepperInfoQuery'
import { LocationMode } from 'libs/location/types'
import { useLocationMode } from 'libs/locationV2/location.store'
import { useGetDepositAmountsByAge } from 'shared/user/useGetDepositAmountsByAge'

export function useOverrideCreditActivationAmount() {
  const { user } = useAuthContext()
  const selectedLocationMode = useLocationMode()
  const { data: subscription } = useGetStepperInfoQuery()

  const amount = useGetDepositAmountsByAge(user?.birthDate)

  const nextSubscriptionStepEnable = !!subscription?.nextSubscriptionStep
  const shouldDisplayActivationFlow = getShouldDisplayActivationFlow(user)
  const isActivationProcessEnable = nextSubscriptionStepEnable || shouldDisplayActivationFlow

  const isUserLocated = selectedLocationMode !== LocationMode.EVERYWHERE
  const isUserRegisteredInPacificFrancRegion = user?.currency === CurrencyEnum.XPF
  const isUserInRelevantLocation = isUserLocated || isUserRegisteredInPacificFrancRegion

  if (isActivationProcessEnable || isUserInRelevantLocation) {
    return { shouldBeOverriden: true, amount }
  }
  return { shouldBeOverriden: false, amount }
}
