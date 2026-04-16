import { UserStatusType } from 'features/auth/helpers/getStatusType'
import { UserProfile } from 'features/share/types'

export const isAndWasBeneficiary = (user?: UserProfile) => {
  if (!user) return false
  return (
    user.statusType === UserStatusType.BENEFICIARY ||
    user.statusType === UserStatusType.ELIGIBLE_AND_BENEFICIARY ||
    user.statusType === UserStatusType.EX_BENEFICIARY
  )
}

export const isCurrentlyBeneficiary = (user?: UserProfile) => {
  if (!user) return false
  return (
    user.statusType === UserStatusType.BENEFICIARY ||
    user.statusType === UserStatusType.ELIGIBLE_AND_BENEFICIARY
  )
}

export const isEligible = (user?: UserProfile) => {
  if (!user) return false
  return (
    user?.statusType === UserStatusType.ELIGIBLE ||
    user?.statusType === UserStatusType.ELIGIBLE_AND_BENEFICIARY
  )
}

export const isNonEligible = (user?: UserProfile) => {
  if (!user) return false
  return (
    user?.statusType === UserStatusType.GENERAL_PUBLIC ||
    user?.statusType === UserStatusType.UNKNOWN ||
    user?.statusType === UserStatusType.SUSPENDED
  )
}
