import { UserProfileResponse, UserRole } from 'api/gen/api'

export const isUserBeneficiary = (user?: UserProfileResponse) => {
  const hasBeneficiaryRole = user?.roles?.find(
    (role) => role === UserRole.BENEFICIARY || role === UserRole.UNDERAGE_BENEFICIARY
  )
  return !!hasBeneficiaryRole
}
