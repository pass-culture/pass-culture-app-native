import { GetReminderResponse, ReminderResponse } from 'features/offer/types'

export const remindersResponse: GetReminderResponse = {
  reminders: [
    {
      id: 1,
      offer: { id: 10 },
    },
    {
      id: 2,
      offer: { id: 20 },
    },
  ],
}

export const reminder: ReminderResponse = {
  id: 1,
  offer: { id: 10 },
}
