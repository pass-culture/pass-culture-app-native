import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { GetRemindersResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME_REMINDERS = 5 * 60 * 1000

export const useGetRemindersQuery = <TData = GetRemindersResponse>(
  select?: (data: GetRemindersResponse) => TData
) => {
  const { isLoggedIn } = useAuthContext()

  return useQuery<GetRemindersResponse, Error, TData>(
    [QueryKeys.REMINDERS],
    () => api.getNativeV1MeReminders(),
    {
      select,
      enabled: isLoggedIn,
      staleTime: STALE_TIME_REMINDERS,
    }
  )
}
