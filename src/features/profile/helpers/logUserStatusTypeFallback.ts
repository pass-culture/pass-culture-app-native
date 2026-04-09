import { UserProfileResponse } from 'api/gen'
import { eventMonitoring } from 'libs/monitoring/services'

export const logUserStatusTypeFallback = ({ user }: { user: UserProfileResponse }) => {
  eventMonitoring.captureException('Profile V2 - User status fallback', {
    level: 'info',
    extra: {
      id: user.id,
      status: user.status?.statusType,
      depositType: user.depositType,
      birthDate: user.birthDate,
    },
  })
}
