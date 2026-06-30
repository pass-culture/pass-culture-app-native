import { CurrencyEnum } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { UserCreditType } from 'features/auth/helpers/getCreditType'
import { getShouldDisplayActivationFlow } from 'features/auth/helpers/getShouldDisplayActivationFlow'
import { useGetStepperInfoQuery } from 'features/identityCheck/queries/useGetStepperInfoQuery'
import { useLocation } from 'libs/location/location'
import { LocationMode } from 'libs/location/types'
import { getAge } from 'shared/user/getAge'
import { useGetDepositAmountsByAge } from 'shared/user/useGetDepositAmountsByAge'

export function useOverrideCreditActivationAmount() {
  const { user } = useAuthContext()
  const { selectedLocationMode } = useLocation()
  const { data: subscription } = useGetStepperInfoQuery()

  const amount = useGetDepositAmountsByAge(user?.birthDate)
  const nextSubscriptionStepEnable = !!subscription?.nextSubscriptionStep
  const shouldDisplayActivationFlow = getShouldDisplayActivationFlow(user)
  const isActivationProcessEnable = nextSubscriptionStepEnable || shouldDisplayActivationFlow

  const isUserLocated = selectedLocationMode !== LocationMode.EVERYWHERE
  const isUserRegisteredInPacificFrancRegion = user?.currency === CurrencyEnum.XPF
  const isUserInRelevantLocation = isUserLocated || isUserRegisteredInPacificFrancRegion

  const userAge = user?.birthDate ? getAge(user.birthDate) : undefined
  const isFreeBeneficiaryWithRelevantAge =
    user?.creditType === UserCreditType.CREDIT_V3_FREE && (userAge === 17 || userAge === 18)

  if (isActivationProcessEnable || isUserInRelevantLocation || isFreeBeneficiaryWithRelevantAge) {
    return { shouldBeOverriden: true, amount }
  }
  return { shouldBeOverriden: false, amount }
}
