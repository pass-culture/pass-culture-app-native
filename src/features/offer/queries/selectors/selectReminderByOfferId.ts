import { isEmpty } from 'lodash'

import { GetRemindersResponse, ReminderResponse } from 'api/gen'

export const selectReminderByOfferId = (
  data: GetRemindersResponse,
  offerId: number
): ReminderResponse | undefined => {
  if (isEmpty(data)) return undefined
  return data.reminders.find((reminder) => reminder.offer.id === offerId)
}
