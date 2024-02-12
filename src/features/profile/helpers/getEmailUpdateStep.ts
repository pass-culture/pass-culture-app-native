import { EmailHistoryEventTypeEnum } from 'api/gen'

export function getEmailUpdateStep(step?: EmailHistoryEventTypeEnum) {
  switch (step) {
    case EmailHistoryEventTypeEnum.UPDATE_REQUEST:
      return 0
    case EmailHistoryEventTypeEnum.CONFIRMATION:
      return 1
    case EmailHistoryEventTypeEnum.VALIDATION:
      return 2
    default:
      return 0
  }
}
