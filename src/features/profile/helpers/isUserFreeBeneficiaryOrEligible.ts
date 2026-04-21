import { UserRole } from 'api/gen/api'
import { getIsUserEligibleFree } from 'features/auth/helpers/getIsUserEligible'
import { UserProfile } from 'features/share/types'

export const isUserFreeBeneficiaryOrEligible = (user?: UserProfile) => {
  const userEligibilityFreeStatus = getIsUserEligibleFree(user?.eligibilityType)
  const userBeneficiaryRole = user?.roles?.find((role) => role === UserRole.FREE_BENEFICIARY)
  return userEligibilityFreeStatus || !!userBeneficiaryRole
}
