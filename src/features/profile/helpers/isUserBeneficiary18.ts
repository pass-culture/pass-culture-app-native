import { UserProfileResponse, UserRole } from 'api/gen/api'

export function isUserBeneficiary18(user: UserProfileResponse): boolean {
  const hasBeneficiary18Role = user.roles?.find((role) => role === UserRole.BENEFICIARY)
  return !!hasBeneficiary18Role
}
