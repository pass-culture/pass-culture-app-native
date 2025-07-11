import { UserProfileResponse, EligibilityType, UserRole } from 'api/gen/api'

export const isUserBeneficiary = (user?: UserProfileResponse) => {
  const userEligibility =
    user?.eligibility === EligibilityType['age-17-18'] ||
    user?.eligibility === EligibilityType['age-18']
  const hasBeneficiaryRole = user?.roles?.find(
    (role) => role === UserRole.BENEFICIARY || role === UserRole.UNDERAGE_BENEFICIARY
  )
  return userEligibility && !!hasBeneficiaryRole
}
