import _ from 'lodash'

import { UserProfileResponse, DomainsCredit, UserRole } from 'api/gen/api'
import { useUserProfileInfo } from 'features/home/api'
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

export function isUserUnderageBeneficiary(user: UserProfileResponse): boolean {
  const hasUserUnderageRole = user?.roles?.find((role) => role === UserRole.UNDERAGEBENEFICIARY)
  return !!hasUserUnderageRole
}

export const useIsUserUnderage = () => {
  const { data: user } = useUserProfileInfo()
  return !!(user && isUserUnderageBeneficiary(user))
}
