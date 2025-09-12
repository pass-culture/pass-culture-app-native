import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME_ACTIVITY_TYPES = 5 * 60 * 1000

const useActivityTypesResponseQuery = () =>
  useQuery({
    queryKey: [QueryKeys.ACTIVITY_TYPES],
    queryFn: () => api.getNativeV1SubscriptionActivityTypes(),
    staleTime: STALE_TIME_ACTIVITY_TYPES,
  })

export const useActivityTypes = () => {
  const { data } = useActivityTypesResponseQuery()
  const activities = data?.activities
  return { activities }
}
