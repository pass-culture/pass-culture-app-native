import { UserProfileResponse } from 'api/gen/api'
import { getAvailableCredit } from 'features/user/helpers/useAvailableCredit'

import { isUserUnderageBeneficiary } from './isUserUnderageBeneficiary'

export function isUserExBeneficiary(user: UserProfileResponse): boolean {
  const credit = getAvailableCredit(user)
  const isExBeneficiary = user.isBeneficiary && credit.isExpired
  const isExUnderageBeneficiary = isUserUnderageBeneficiary(user) && credit.isExpired
  return isExBeneficiary || isExUnderageBeneficiary
}
