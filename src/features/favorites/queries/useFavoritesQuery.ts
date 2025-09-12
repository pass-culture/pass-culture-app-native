import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { QueryKeys } from 'libs/queryKeys'

// arbitrary. We have to make sure we invalidate the cache when adding/removing favorites. See above
const STALE_TIME_FAVORITES = 5 * 60 * 1000

export const useFavoritesQuery = () => {
  const { isLoggedIn } = useAuthContext()

  return useQuery({
    queryKey: [QueryKeys.FAVORITES],
    queryFn: () => api.getNativeV1MeFavorites(),
    enabled: isLoggedIn,
    staleTime: STALE_TIME_FAVORITES,
  })
}
