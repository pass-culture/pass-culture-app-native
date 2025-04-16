import { useQuery } from 'react-query'

import { api } from 'api/api'
import { GetRemindersResponse } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME_REMINDERS = 5 * 60 * 1000

export const useGetRemindersQuery = <TData = GetRemindersResponse>(
  select?: (data: GetRemindersResponse) => TData
) => {
  return useQuery<GetRemindersResponse, Error, TData>(
    [QueryKeys.REMINDERS],
    () => api.getNativeV1MeReminders(),
    {
      select,
      staleTime: STALE_TIME_REMINDERS,
    }
  )
}
