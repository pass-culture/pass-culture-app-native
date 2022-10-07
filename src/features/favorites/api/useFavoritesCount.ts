import { useQuery } from 'react-query'

import { api } from 'api/api'
import { FavoritesCountResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { STALE_TIME_FAVORITES } from 'features/favorites/api/useFavorites'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

export function useFavoritesCount() {
  const { isLoggedIn } = useAuthContext()
  const netInfo = useNetInfoContext()

  return useQuery(QueryKeys.FAVORITES_COUNT, () => api.getnativev1mefavoritescount(), {
    enabled: !!netInfo.isConnected && isLoggedIn,
    staleTime: STALE_TIME_FAVORITES,
    select: (data: FavoritesCountResponse) => data.count,
  })
}
