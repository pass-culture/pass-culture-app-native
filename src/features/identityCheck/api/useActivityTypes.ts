import { useQuery } from 'react-query'

import { api } from 'api/api'
import { ActivityTypesResponse } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME_ACTIVITY_TYPES = 5 * 60 * 1000

function useActivityTypesResponse() {
  return useQuery<ActivityTypesResponse>(
    [QueryKeys.ACTIVITY_TYPES],
    () => api.getNativeV1SubscriptionActivityTypes(),
    { staleTime: STALE_TIME_ACTIVITY_TYPES }
  )
}

export const useActivityTypes = () => {
  const { data } = useActivityTypesResponse()
  const activities = data?.activities
  return { activities }
}
