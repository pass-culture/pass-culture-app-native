import { UserRole } from 'api/gen/api'
import { UserEligibilityType } from 'features/auth/helpers/getEligibilityType'
import { UserProfile } from 'features/share/types'

export const isUserFreeBeneficiaryOrEligible = (user?: UserProfile) => {
  const userEligibility =
    user?.eligibilityType === UserEligibilityType.ELIGIBLE_CREDIT_V3_16 ||
    user?.eligibilityType === UserEligibilityType.ELIGIBLE_CREDIT_V3_15
  const userBeneficiaryRole = user?.roles?.find((role) => role === UserRole.FREE_BENEFICIARY)
  return userEligibility || !!userBeneficiaryRole
}
