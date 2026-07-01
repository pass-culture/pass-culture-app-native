import { UserProfileResponse, YoungStatusType } from 'api/gen'
import { UserCreditType, getCreditType } from 'features/auth/helpers/getCreditType'
import { logUserStatusTypeFallback } from 'features/profile/helpers/logUserStatusTypeFallback'

export enum UserStatusType {
  ELIGIBLE = 'ELIGIBLE',
  ELIGIBLE_AND_FREE_BENEFICIARY = 'ELIGIBLE_AND_FREE_BENEFICIARY',
  ELIGIBLE_AND_BENEFICIARY = 'ELIGIBLE_AND_BENEFICIARY',
  BENEFICIARY = 'BENEFICIARY',
  EX_BENEFICIARY = 'EX_BENEFICIARY',
  GENERAL_PUBLIC = 'GENERAL_PUBLIC',
  SUSPENDED = 'SUSPENDED',
  UNKNOWN = 'UNKNOWN',
}

export const getStatusType = (user: UserProfileResponse): UserStatusType => {
  const { status } = user

  if (!user || !status) return UserStatusType.UNKNOWN

  const creditType = getCreditType(user)
  const isBeneficiary = ![UserCreditType.CREDIT_EXPIRED, UserCreditType.NO_CREDIT].includes(
    creditType
  )
  const isFreeBeneficiary = creditType === UserCreditType.CREDIT_V3_FREE

  switch (status.statusType) {
    case YoungStatusType.eligible:
      if (isFreeBeneficiary) return UserStatusType.ELIGIBLE_AND_FREE_BENEFICIARY
      if (isBeneficiary) return UserStatusType.ELIGIBLE_AND_BENEFICIARY
      return UserStatusType.ELIGIBLE
    case YoungStatusType.beneficiary:
      return UserStatusType.BENEFICIARY
    case YoungStatusType.ex_beneficiary:
      return UserStatusType.EX_BENEFICIARY
    case YoungStatusType.non_eligible:
      return UserStatusType.GENERAL_PUBLIC
    case YoungStatusType.suspended:
      return UserStatusType.SUSPENDED
    default:
      logUserStatusTypeFallback({ user })
      return UserStatusType.UNKNOWN
  }
}
