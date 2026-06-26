import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME_ACTIVITY_TYPES = 24 * 60 * 60 * 1000

export const useActivityTypesQuery = () => {
  const { isLoggedIn } = useAuthContext()
  return useQuery({
    queryKey: [QueryKeys.ACTIVITY_TYPES],
    queryFn: () => api.getNativeV1SubscriptionActivityTypes(),
    staleTime: STALE_TIME_ACTIVITY_TYPES,
    enabled: isLoggedIn,
    meta: { private: true },
  })
}

export const useActivityTypes = () => {
  const { data } = useActivityTypesQuery()
  const activities = data?.activities
  return { activities }
}
