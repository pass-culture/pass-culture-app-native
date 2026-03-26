import { UserStatusType } from 'features/auth/helpers/getStatusType'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { eventMonitoring } from 'libs/monitoring/services'

type LogHeaderFallbackParams = {
  user: UserProfileResponseWithoutSurvey
  headerType: UserStatusType
}

export const logHeaderFallback = ({ user, headerType }: LogHeaderFallbackParams) => {
  eventMonitoring.captureException('Profile V2 - Header fallback', {
    level: 'info',
    extra: {
      id: user.id,
      eligibilityType: user.eligibilityType,
      creditType: user.creditType,
      statusType: user.statusType,
      status: user.status,
      isBeneficiary: user.isBeneficiary,
      headerType,
    },
  })
}
