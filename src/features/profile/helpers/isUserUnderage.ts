import { UserEligibilityType } from 'features/auth/helpers/getEligibilityType'
import { UserProfile } from 'features/share/types'

export const isUserUnderage = (user?: UserProfile) =>
  user?.eligibilityType === UserEligibilityType.ELIGIBLE_CREDIT_V2_17 ||
  user?.eligibilityType === UserEligibilityType.ELIGIBLE_CREDIT_V2_16 ||
  user?.eligibilityType === UserEligibilityType.ELIGIBLE_CREDIT_V2_15
