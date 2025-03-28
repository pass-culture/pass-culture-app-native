import { isEmpty } from 'lodash'

import { GetReminderResponse, ReminderResponse } from 'features/offer/types'

export const selectReminderByOfferId = (
  data: GetReminderResponse,
  offerId: number
): ReminderResponse | undefined => {
  if (isEmpty(data)) return undefined
  return data.reminders.find((reminder) => reminder.offer.id === offerId)
}
