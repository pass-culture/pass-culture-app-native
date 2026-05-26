import { UserEligibilityType } from 'features/auth/helpers/getEligibilityType'

export const shouldProvidePhoneNumber = (user) =>
  user?.eligibilityType === UserEligibilityType.ELIGIBLE_CREDIT_V3_18
