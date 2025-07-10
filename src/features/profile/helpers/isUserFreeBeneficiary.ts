import { UserProfileResponse, EligibilityType, UserRole } from 'api/gen/api'

export const isUserFreeBeneficiary = (user?: UserProfileResponse) => {
  const userEligibility = user?.eligibility === EligibilityType.free
  const userBeneficiaryRole = user?.roles?.find((role) => role === UserRole.FREE_BENEFICIARY)
  return userEligibility && !!userBeneficiaryRole
}
