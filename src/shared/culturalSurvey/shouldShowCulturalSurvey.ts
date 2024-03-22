import { UserProfileResponse } from 'api/gen'

export function shouldShowCulturalSurvey(user?: UserProfileResponse) {
  return !!user?.needsToFillCulturalSurvey
}
