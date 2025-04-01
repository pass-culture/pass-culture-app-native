import { useQuery } from 'react-query'

import { api } from 'api/api'
import { GetReminderResponse } from 'features/offer/types'
import { QueryKeys } from 'libs/queryKeys'

export const useGetRemindersQuery = <TData = GetReminderResponse>(
  select?: (data: GetReminderResponse) => TData
) => {
  return useQuery<GetReminderResponse, Error, TData>(
    [QueryKeys.REMINDERS],
    () => api.getNativeV1MeReminders(),
    {
      select,
    }
  )
}
