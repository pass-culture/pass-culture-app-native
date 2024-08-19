import { EmailHistoryEventTypeEnum } from 'api/gen'

export function getEmailUpdateStep(
  hasRecentlyResetPassword: boolean,
  step?: EmailHistoryEventTypeEnum
) {
  switch (step) {
    case EmailHistoryEventTypeEnum.CONFIRMATION:
      return 1 + Number(hasRecentlyResetPassword)
    case EmailHistoryEventTypeEnum.NEW_EMAIL_SELECTION:
      return 2 + Number(hasRecentlyResetPassword)
    case EmailHistoryEventTypeEnum.VALIDATION:
      return 3 + Number(hasRecentlyResetPassword)
    default:
      return 0
  }
}
