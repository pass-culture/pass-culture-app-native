import { UserProfileResponse, YoungStatusType } from 'api/gen'

export enum UserStatusType {
  UNKNOWN = 'UNKNOWN',
  ELIGIBLE = 'ELIGIBLE',
  GENERAL_PUBLIC = 'GENERAL_PUBLIC',
  BENEFICIARY = 'BENEFICIARY',
  EX_BENEFICIARY = 'EX_BENEFICIARY',
  SUSPENDED = 'SUSPENDED',
}

export const getStatusType = ({ status }: UserProfileResponse): UserStatusType => {
  switch (status.statusType) {
    case YoungStatusType.beneficiary:
      return UserStatusType.BENEFICIARY
    case YoungStatusType.ex_beneficiary:
      return UserStatusType.EX_BENEFICIARY
    case YoungStatusType.eligible:
      return UserStatusType.ELIGIBLE
    case YoungStatusType.non_eligible:
      return UserStatusType.GENERAL_PUBLIC
    case YoungStatusType.suspended:
      return UserStatusType.SUSPENDED
    default:
      return UserStatusType.UNKNOWN
  }
}
