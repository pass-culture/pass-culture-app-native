import { UserProfileResponse } from 'api/gen'
import { eventMonitoring } from 'libs/monitoring/services'

export const logUserCreditTypeFallback = ({ user }: { user: UserProfileResponse }) => {
  eventMonitoring.captureException('Profile V2 - User credit fallback', {
    level: 'info',
    extra: { user },
  })
}
