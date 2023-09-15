import { useQuery } from 'react-query'

import { api } from 'api/api'
import { ActivityTypesResponse } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME_PROFILE_OPTIONS = 5 * 60 * 1000

function useActivityTypesResponse() {
  return useQuery<ActivityTypesResponse>(
    [QueryKeys.ACTIVITY_TYPES],
    () => api.getNativeV1SubscriptionActivityTypes(),
    { staleTime: STALE_TIME_PROFILE_OPTIONS }
  )
}

export const useActivityTypes = () => {
  const { data } = useActivityTypesResponse()
  const activities = data?.activities
  return { activities }
}
