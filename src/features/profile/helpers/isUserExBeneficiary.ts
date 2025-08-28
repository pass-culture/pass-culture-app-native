import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { getAvailableCredit } from 'shared/user/useAvailableCredit'

import { isUserUnderageBeneficiary } from './isUserUnderageBeneficiary'

export function isUserExBeneficiary(user: UserProfileResponseWithoutSurvey): boolean {
  const credit = getAvailableCredit(user)
  const isExBeneficiary = user.isBeneficiary && credit.isExpired
  const isExUnderageBeneficiary = isUserUnderageBeneficiary(user) && credit.isExpired
  return isExBeneficiary || isExUnderageBeneficiary
}
