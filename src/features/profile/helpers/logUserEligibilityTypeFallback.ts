import { UserProfileResponse } from 'api/gen'
import { eventMonitoring } from 'libs/monitoring/services'

export const logUserEligibilityTypeFallback = ({ user }: { user: UserProfileResponse }) => {
  eventMonitoring.captureException('User eligibility fallback', {
    level: 'info',
    extra: {
      id: user.id,
      eligibility: user.eligibility,
      depositType: user.depositType,
      qfBonificationStatus: user.qfBonificationStatus,
      isEligibleForBeneficiaryUpgrade: user.isEligibleForBeneficiaryUpgrade,
      birthDate: user.birthDate,
    },
  })
}
