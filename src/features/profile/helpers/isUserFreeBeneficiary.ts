import { EligibilityType, UserRole } from 'api/gen/api'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'

export const isUserFreeBeneficiary = (user?: UserProfileResponseWithoutSurvey) => {
  const userEligibility = user?.eligibility === EligibilityType.free
  const userBeneficiaryRole = user?.roles?.find((role) => role === UserRole.FREE_BENEFICIARY)
  return userEligibility && !!userBeneficiaryRole
}
