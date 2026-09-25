import { UserProfileResponse } from 'api/gen'
import { eventMonitoring } from 'libs/monitoring/services'

export const logUserEligibilityTypeFallback = ({ user }: { user: UserProfileResponse }) => {
  eventMonitoring.captureException('Profile V2 - User eligibility fallback', {
    level: 'info',
    extra: { user },
  })
}
