import _ from 'lodash'

import { UserProfileResponse, DomainsCredit } from 'api/gen/api'
import { Credit } from 'features/home/services/useAvailableCredit'

export function isUserBeneficiary(user: UserProfileResponse): boolean {
  return user.isBeneficiary
}

export function isUserExBeneficiary(user: UserProfileResponse, credit: Credit): boolean {
  return user.isBeneficiary && credit.isExpired
}

export const computeCredit = (domainsCredit?: DomainsCredit | null) => {
  return domainsCredit ? domainsCredit.all.remaining : 0
}
