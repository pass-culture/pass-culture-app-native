import { DepositType, UserProfileResponse, YoungStatusType } from 'api/gen'
import { getAge } from 'shared/user/getAge'

export enum UserStatusType {
  ELIGIBLE = 'ELIGIBLE',
  ELIGIBLE_AND_BENEFICIARY = 'ELIGIBLE_AND_BENEFICIARY',
  BENEFICIARY = 'BENEFICIARY',
  EX_BENEFICIARY = 'EX_BENEFICIARY',
  GENERAL_PUBLIC = 'GENERAL_PUBLIC',
  SUSPENDED = 'SUSPENDED',
  UNKNOWN = 'UNKNOWN',
}

export const getStatusType = ({
  status,
  birthDate,
  depositType,
}: UserProfileResponse): UserStatusType => {
  const age = getAge(birthDate)
  const isEighteenOrMore = age && age >= 18
  const isCreditV3 = depositType === DepositType.GRANT_17_18
  const isBeneficiaryWithCreditV3Seventeen = isCreditV3 && isEighteenOrMore

  switch (status.statusType) {
    case YoungStatusType.eligible:
      if (isBeneficiaryWithCreditV3Seventeen) return UserStatusType.ELIGIBLE_AND_BENEFICIARY
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
      return UserStatusType.UNKNOWN
  }
}
