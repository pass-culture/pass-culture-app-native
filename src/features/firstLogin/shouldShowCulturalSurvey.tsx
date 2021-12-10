import { SettingsResponse, UserProfileResponse } from 'api/gen'
import { useAppSettings } from 'features/auth/settings'
import { useUserProfileInfo } from 'features/home/api'

export function shouldShowCulturalSurvey(
  user: UserProfileResponse | undefined,
  settings: SettingsResponse | undefined
): boolean {
  if (!user || !settings) return false
  return user.isBeneficiary && user.needsToFillCulturalSurvey && settings.enableCulturalSurvey
}

export function useShouldShowCulturalSurvey(): boolean {
  const { data: user } = useUserProfileInfo()
  const { data: settings } = useAppSettings()
  return shouldShowCulturalSurvey(user, settings)
}
