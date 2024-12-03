import { useQuery } from 'react-query'

import { api } from 'api/api'
import { ActivityTypesResponse } from 'api/gen'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME_ACTIVITY_TYPES = 5 * 60 * 1000

function useActivityTypesResponse() {
  const netInfo = useNetInfoContext()

  return useQuery<ActivityTypesResponse>(
    [QueryKeys.ACTIVITY_TYPES],
    () => api.getNativeV1SubscriptionActivityTypes(),
    {
      staleTime: STALE_TIME_ACTIVITY_TYPES,
      enabled: !!netInfo.isConnected && !!netInfo.isInternetReachable,
    }
  )
}

export const useActivityTypes = () => {
  const { data } = useActivityTypesResponse()
  const activities = data?.activities
  return { activities }
}
