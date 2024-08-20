import { EmailHistoryEventTypeEnum } from 'api/gen'

export function getEmailUpdateStep(
  hasRecentlyResetPassword: boolean,
  step?: EmailHistoryEventTypeEnum
) {
  const hasReset = hasRecentlyResetPassword ? 1 : 0
  switch (step) {
    case EmailHistoryEventTypeEnum.CONFIRMATION:
      return 1 + hasReset
    case EmailHistoryEventTypeEnum.NEW_EMAIL_SELECTION:
      return 2 + hasReset
    case EmailHistoryEventTypeEnum.VALIDATION:
      return 3 + hasReset
    default:
      return 0
  }
}
