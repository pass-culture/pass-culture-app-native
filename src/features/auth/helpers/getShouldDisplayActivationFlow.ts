import { UserCreditType } from 'features/auth/helpers/getCreditType'
import { UserEligibilityType } from 'features/auth/helpers/getEligibilityType'
import { UserProfile } from 'features/share/types'

const activationFlowByEligibility: Partial<
  Record<UserEligibilityType, ReadonlyArray<UserCreditType>>
> = {
  [UserEligibilityType.ELIGIBLE_CREDIT_V2_15]: [UserCreditType.CREDIT_UNKNOWN],
  [UserEligibilityType.ELIGIBLE_CREDIT_V2_16]: [UserCreditType.CREDIT_UNKNOWN],
  [UserEligibilityType.ELIGIBLE_CREDIT_V2_17]: [UserCreditType.CREDIT_UNKNOWN],
  [UserEligibilityType.ELIGIBLE_CREDIT_V2_18]: [
    UserCreditType.CREDIT_UNKNOWN,
    UserCreditType.CREDIT_V2_15,
    UserCreditType.CREDIT_V2_16,
    UserCreditType.CREDIT_V2_17,
  ],
  [UserEligibilityType.ELIGIBLE_CREDIT_V3_17]: [
    UserCreditType.CREDIT_UNKNOWN,
    UserCreditType.CREDIT_V3_FREE,
  ],
  [UserEligibilityType.ELIGIBLE_CREDIT_V3_18]: [
    UserCreditType.CREDIT_UNKNOWN,
    UserCreditType.CREDIT_V2_15,
    UserCreditType.CREDIT_V2_16,
    UserCreditType.CREDIT_V2_17,
    UserCreditType.CREDIT_V3_FREE,
    UserCreditType.CREDIT_V3_17,
  ],
}

export const getShouldDisplayActivationFlow = (user?: UserProfile | undefined) => {
  if (!user) return false
  const { creditType, eligibilityType } = user

  const authorizedCreditTypes = activationFlowByEligibility[eligibilityType]
  if (!authorizedCreditTypes) return false

  return authorizedCreditTypes.includes(creditType)
}
