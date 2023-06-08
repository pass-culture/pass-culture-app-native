import { EmailHistoryEventTypeEnum } from 'api/gen'

export function getEmailUpdateStep(step?: EmailHistoryEventTypeEnum) {
  switch (step) {
    case EmailHistoryEventTypeEnum.UPDATE_REQUEST:
      return 1
    case EmailHistoryEventTypeEnum.CONFIRMATION:
      return 2
    case EmailHistoryEventTypeEnum.VALIDATION:
      return 3
    default:
      return 0
  }
}
