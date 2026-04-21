import { UserCreditType } from 'features/auth/helpers/getCreditType'
import { UserEligibilityType } from 'features/auth/helpers/getEligibilityType'
import { UserStatusType } from 'features/auth/helpers/getStatusType'
import { UserProfile } from 'features/share/types'

const activationFlowByEligibility: Partial<
  Record<UserEligibilityType, ReadonlyArray<UserCreditType>>
> = {
  [UserEligibilityType.ELIGIBLE_CREDIT_V2_15]: [UserCreditType.CREDIT_UNKNOWN],
  [UserEligibilityType.ELIGIBLE_CREDIT_V2_16]: [
    UserCreditType.CREDIT_UNKNOWN,
    UserCreditType.CREDIT_V2_15,
  ],
  [UserEligibilityType.ELIGIBLE_CREDIT_V2_17]: [
    UserCreditType.CREDIT_UNKNOWN,
    UserCreditType.CREDIT_V2_15,
    UserCreditType.CREDIT_V2_16,
  ],
  [UserEligibilityType.ELIGIBLE_CREDIT_V2_18]: [
    UserCreditType.CREDIT_UNKNOWN,
    UserCreditType.CREDIT_V2_15,
    UserCreditType.CREDIT_V2_16,
    UserCreditType.CREDIT_V2_17,
  ],
  [UserEligibilityType.ELIGIBLE_CREDIT_V3_17]: [
    UserCreditType.CREDIT_UNKNOWN,
    UserCreditType.CREDIT_V2_15,
    UserCreditType.CREDIT_V2_16,
    UserCreditType.CREDIT_V3_15,
    UserCreditType.CREDIT_V3_16,
  ],
  [UserEligibilityType.ELIGIBLE_CREDIT_V3_18]: [
    UserCreditType.CREDIT_UNKNOWN,
    UserCreditType.CREDIT_V2_15,
    UserCreditType.CREDIT_V2_16,
    UserCreditType.CREDIT_V2_17,
    UserCreditType.CREDIT_V3_15,
    UserCreditType.CREDIT_V3_16,
    UserCreditType.CREDIT_V3_17,
  ],
}

const statusAllowedForEmptyCredit = new Set<UserStatusType>([
  UserStatusType.ELIGIBLE,
  UserStatusType.ELIGIBLE_AND_BENEFICIARY,
])

export const getShouldDisplayActivationFlow = (user?: UserProfile | undefined) => {
  if (!user) return false
  const { creditType, statusType, eligibilityType } = user
  if (creditType === UserCreditType.CREDIT_EMPTY) {
    return statusType ? statusAllowedForEmptyCredit.has(statusType) : false
  }

  const authorizedCreditTypes = activationFlowByEligibility[eligibilityType]
  if (!authorizedCreditTypes) return false

  return authorizedCreditTypes.includes(creditType)
}
