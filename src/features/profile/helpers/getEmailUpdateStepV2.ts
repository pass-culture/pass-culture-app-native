import { EmailHistoryEventTypeEnum } from 'api/gen'

export function getEmailUpdateStepV2(step?: EmailHistoryEventTypeEnum) {
  switch (step) {
    case EmailHistoryEventTypeEnum.CONFIRMATION:
      return 1
    case EmailHistoryEventTypeEnum.NEW_EMAIL_SELECTION:
      return 2
    case EmailHistoryEventTypeEnum.VALIDATION:
      return 3
    default:
      return 0
  }
}
