import { UserEligibilityType } from 'features/auth/helpers/getEligibilityType'

export const getIsUserEligible = (eligibilityType?: UserEligibilityType | null) => {
  const eligibleFreeStatuses = [
    UserEligibilityType.ELIGIBLE_CREDIT_V3_16,
    UserEligibilityType.ELIGIBLE_CREDIT_V3_15,
  ]
  return eligibilityType ? eligibleFreeStatuses.includes(eligibilityType) : false
}
