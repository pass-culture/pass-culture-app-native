import { UserProfileResponse, UserRole } from 'api/gen/api'

export function isUserUnderageBeneficiary(user: UserProfileResponse | undefined): boolean {
  if (!user) return false
  const hasUserUnderageRole = user.roles?.find((role) => role === UserRole.UNDERAGE_BENEFICIARY)
  return !!hasUserUnderageRole
}
