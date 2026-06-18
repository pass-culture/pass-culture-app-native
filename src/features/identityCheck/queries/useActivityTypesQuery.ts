import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME_ACTIVITY_TYPES = 5 * 60 * 1000

const useActivityTypesResponseQuery = (enabled?: boolean) =>
  useQuery({
    queryKey: [QueryKeys.ACTIVITY_TYPES],
    queryFn: () => api.getNativeV1SubscriptionActivityTypes(),
    staleTime: STALE_TIME_ACTIVITY_TYPES,
    enabled: enabled ?? false,
    meta: { private: true },
  })

export const useActivityTypes = () => {
  const { isLoggedIn } = useAuthContext()
  const { data } = useActivityTypesResponseQuery(isLoggedIn)
  const activities = data?.activities
  return { activities }
}
