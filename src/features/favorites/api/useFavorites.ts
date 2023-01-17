import { useQuery } from 'react-query'

import { api } from 'api/api'
import { PaginatedFavoritesResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

// arbitrary. We have to make sure we invalidate the cache when adding/removing favorites. See above
export const STALE_TIME_FAVORITES = 5 * 60 * 1000

export function useFavorites() {
  const netInfo = useNetInfoContext()
  const { isLoggedIn } = useAuthContext()

  return useQuery<PaginatedFavoritesResponse>(
    QueryKeys.FAVORITES,
    () => api.getnativev1mefavorites(),
    { enabled: !!netInfo.isConnected && isLoggedIn, staleTime: STALE_TIME_FAVORITES }
  )
}
