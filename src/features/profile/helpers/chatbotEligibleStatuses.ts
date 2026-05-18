import { UserStatusType } from 'features/auth/helpers/getStatusType'

export const CHATBOT_ELIGIBLE_STATUSES = new Set<UserStatusType>([
  UserStatusType.ELIGIBLE,
  UserStatusType.BENEFICIARY,
  UserStatusType.EX_BENEFICIARY,
  UserStatusType.ELIGIBLE_AND_BENEFICIARY,
])
