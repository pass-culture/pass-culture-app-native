import { UserRole } from 'api/gen/api'
import { UserProfile } from 'features/share/types'

export const isUserBeneficiary = (user?: UserProfile) => {
  const hasBeneficiaryRole = user?.roles?.find(
    (role) => role === UserRole.BENEFICIARY || role === UserRole.UNDERAGE_BENEFICIARY
  )
  return !!hasBeneficiaryRole
}
