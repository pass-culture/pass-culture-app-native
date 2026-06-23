import { DepositType, UserProfileResponse, YoungStatusType } from 'api/gen'
import { logUserStatusTypeFallback } from 'features/profile/helpers/logUserStatusTypeFallback'
import { getAge } from 'shared/user/getAge'

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
  const { status, birthDate, depositType } = user

  if (!user || !status) return UserStatusType.UNKNOWN

  const age = getAge(birthDate)
  const isEighteenOrMore = age && age >= 18
  const isSeventeenOrMore = age && age >= 17
  const isCreditV3 = depositType === DepositType.GRANT_17_18
  const isEligibleAndBeneficiary = isCreditV3 && isEighteenOrMore
  const isEligibleAndFreeBeneficiary = depositType === DepositType.GRANT_FREE && isSeventeenOrMore

  switch (status.statusType) {
    case YoungStatusType.eligible:
      if (isEligibleAndFreeBeneficiary) return UserStatusType.ELIGIBLE_AND_FREE_BENEFICIARY
      if (isEligibleAndBeneficiary) return UserStatusType.ELIGIBLE_AND_BENEFICIARY
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
