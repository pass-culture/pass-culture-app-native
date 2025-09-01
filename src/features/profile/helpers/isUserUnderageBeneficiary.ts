import { UserRole } from 'api/gen/api'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'

export function isUserUnderageBeneficiary(
  user: UserProfileResponseWithoutSurvey | undefined
): boolean {
  if (!user) return false
  const hasUserUnderageRole = user.roles?.find((role) => role === UserRole.UNDERAGE_BENEFICIARY)
  return !!hasUserUnderageRole
}
