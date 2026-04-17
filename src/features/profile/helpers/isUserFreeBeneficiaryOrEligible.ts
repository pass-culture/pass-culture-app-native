import { UserRole } from 'api/gen/api'
import { getIsUserEligible } from 'features/auth/helpers/getIsUserEligible'
import { UserProfile } from 'features/share/types'

export const isUserFreeBeneficiaryOrEligible = (user?: UserProfile) => {
  const userEligibilityFreeStatus = getIsUserEligible(user?.eligibilityType)
  const userBeneficiaryRole = user?.roles?.find((role) => role === UserRole.FREE_BENEFICIARY)
  return userEligibilityFreeStatus || !!userBeneficiaryRole
}
