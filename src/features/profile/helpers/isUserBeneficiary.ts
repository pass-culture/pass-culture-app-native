import { UserRole } from 'api/gen/api'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'

export const isUserBeneficiary = (user?: UserProfileResponseWithoutSurvey) => {
  const hasBeneficiaryRole = user?.roles?.find(
    (role) => role === UserRole.BENEFICIARY || role === UserRole.UNDERAGE_BENEFICIARY
  )
  return !!hasBeneficiaryRole
}
