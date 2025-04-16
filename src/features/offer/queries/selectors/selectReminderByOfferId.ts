import { isEmpty } from 'lodash'

import { GetRemindersResponse, ReminderResponse } from 'api/gen'

export const selectReminderByOfferId = (
  data: GetRemindersResponse,
  offerId: number
): ReminderResponse | undefined => {
  return isEmpty(data)
    ? undefined
    : data.reminders.find((reminder) => reminder.offer.id === offerId)
}
