import { UserStatusType } from 'features/auth/helpers/getStatusType'

export const isCurrentlyBeneficiary = (statusType) =>
  statusType === UserStatusType.BENEFICIARY ||
  statusType === UserStatusType.ELIGIBLE_AND_BENEFICIARY

export const isAndWasBeneficiary = (statusType) =>
  statusType === UserStatusType.BENEFICIARY ||
  statusType === UserStatusType.ELIGIBLE_AND_BENEFICIARY ||
  statusType === UserStatusType.EX_BENEFICIARY

export const isEligible = (statusType) =>
  statusType === UserStatusType.ELIGIBLE || statusType === UserStatusType.ELIGIBLE_AND_BENEFICIARY

export const isNonEligible = (statusType) =>
  statusType === UserStatusType.GENERAL_PUBLIC ||
  statusType === UserStatusType.UNKNOWN ||
  statusType === UserStatusType.SUSPENDED
