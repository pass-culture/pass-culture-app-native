import { UserEligibilityType } from 'features/auth/helpers/getEligibilityType'

export const getIsUserEligibleFree = (eligibilityType?: UserEligibilityType | null) => {
  const eligibleFreeStatuses = [UserEligibilityType.ELIGIBLE_CREDIT_V3_15_16]
  return eligibilityType ? eligibleFreeStatuses.includes(eligibilityType) : false
}
