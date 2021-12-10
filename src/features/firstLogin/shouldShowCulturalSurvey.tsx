import { UserProfileResponse } from 'api/gen'

export function shouldShowCulturalSurvey(user: UserProfileResponse | undefined): boolean {
  if (!user) return false
  return user.isBeneficiary && user.needsToFillCulturalSurvey
}
