import { GetRemindersResponse, ReminderResponse } from 'api/gen'

export const remindersResponse: GetRemindersResponse = {
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
