import { UserProfile } from 'features/share/types'
import { isFreeBeneficiary } from 'shared/user/checkCreditType'
import { getIsUserEligibleFree } from 'shared/user/checkEligibilityType'

export const isUserFreeBeneficiaryOrEligible = (user?: UserProfile) => {
  const userEligibleFree = getIsUserEligibleFree(user?.eligibilityType)
  const userFreeBeneficiary = isFreeBeneficiary(user)
  return userEligibleFree || userFreeBeneficiary
}
