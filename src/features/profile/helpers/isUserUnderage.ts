import { UserEligibilityType } from 'features/auth/helpers/getEligibilityType'
import { UserProfile } from 'features/share/types'

export const isUserUnderage = (user?: UserProfile) =>
  user?.eligibilityType === UserEligibilityType.ELIGIBLE_CREDIT_V2_15_17
