import { UserProfileResponse } from 'api/gen'
import { eventMonitoring } from 'libs/monitoring/services'

export const logUserCreditTypeFallback = ({ user }: { user: UserProfileResponse }) => {
  eventMonitoring.captureException('Profile V2 - User credit fallback', {
    level: 'info',
    extra: {
      id: user.id,
      depositType: user.depositType,
      domainsCredit: user.domainsCredit,
      birthDate: user.birthDate,
      depositExpirationDate: user.depositExpirationDate,
      isEligibleForBeneficiaryUpgrade: user.isEligibleForBeneficiaryUpgrade,
    },
  })
}
