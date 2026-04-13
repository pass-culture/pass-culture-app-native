import { EligibilityType, UserRole } from 'api/gen/api'
import { UserProfile } from 'features/share/types'

export const isUserFreeBeneficiaryOrEligible = (user?: UserProfile) => {
  const userEligibility = user?.eligibility === EligibilityType.free
  const userBeneficiaryRole = user?.roles?.find((role) => role === UserRole.FREE_BENEFICIARY)
  return userEligibility || !!userBeneficiaryRole
}
