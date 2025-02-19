import { useQuery, UseQueryResult } from 'react-query'

import { api } from 'api/api'
import { PaginatedFavoritesResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { QueryKeys } from 'libs/queryKeys'

// arbitrary. We have to make sure we invalidate the cache when adding/removing favorites. See above
const STALE_TIME_FAVORITES = 5 * 60 * 1000

export const useFavoritesQuery = <TData = PaginatedFavoritesResponse>(
  select?: (data: PaginatedFavoritesResponse) => TData
): UseQueryResult<TData, unknown> => {
  // comment on rend générique maintenant ?
  const { isLoggedIn } = useAuthContext()

  return useQuery({
    queryKey: [QueryKeys.FAVORITES],
    queryFn: api.getNativeV1MeFavorites,
    select,
    enabled: isLoggedIn,
    staleTime: STALE_TIME_FAVORITES,
  })
}
