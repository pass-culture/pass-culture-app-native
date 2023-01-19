import { UserProfileResponse } from 'api/gen'

export function shouldShowCulturalSurvey(user?: UserProfileResponse) {
  if (!user) return false
  return user.needsToFillCulturalSurvey
}
