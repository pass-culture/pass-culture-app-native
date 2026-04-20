import { UserStatusType } from 'features/auth/helpers/getStatusType'
import { UserProfile } from 'features/share/types'
import { getAvailableCredit } from 'shared/user/useAvailableCredit'

import { isUserUnderageBeneficiary } from './isUserUnderageBeneficiary'

export function isUserExBeneficiary(user: UserProfile): boolean {
  const credit = getAvailableCredit(user)
  const isExBeneficiary =
    user.statusType === UserStatusType.EX_BENEFICIARY ||
    (user.statusType === UserStatusType.BENEFICIARY && credit.isExpired)
  const isExUnderageBeneficiary = isUserUnderageBeneficiary(user) && credit.isExpired
  return isExBeneficiary || isExUnderageBeneficiary
}
