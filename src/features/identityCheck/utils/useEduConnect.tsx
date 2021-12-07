import { EligibilityCheckMethods } from 'api/gen'
import { useAppSettings } from 'features/auth/settings'
import { useUserProfileInfo } from 'features/home/api'

export function useEduconnect() {
  const { data: settings } = useAppSettings()
  const { data: userProfileInfo } = useUserProfileInfo({
    cacheTime: 0,
  })

  const eligibilityCheckMethods = userProfileInfo?.allowedEligibilityCheckMethods
  const shouldUseEduConnect =
    !!settings?.enableNativeEacIndividual &&
    eligibilityCheckMethods?.includes(EligibilityCheckMethods.Educonnect)
  return { shouldUseEduConnect }
}
