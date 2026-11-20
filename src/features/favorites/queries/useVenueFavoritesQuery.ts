// features/favorites/queries/useArtistFavoritesQuery.ts
import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { PaginatedResponseFavoriteVenueResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME_FAVORITES = 5 * 60 * 1000

type UseVenueFavoritesQueryOptions<TData = PaginatedResponseFavoriteVenueResponse> = {
  enabled?: boolean
  select?: (data: PaginatedResponseFavoriteVenueResponse) => TData
}

export const useVenueFavoritesQuery = <TData = PaginatedResponseFavoriteVenueResponse>({
  enabled = true,
  select,
}: UseVenueFavoritesQueryOptions<TData> = {}) => {
  const { isLoggedIn } = useAuthContext()

  return useQuery({
    queryKey: [QueryKeys.FAVORITES_VENUE],
    queryFn: async () => {
      try {
        return await api.getNativeV2MeFavoritesVenues()
      } catch {
        return {
          favorites: [],
          nbFavorites: 0,
          page: 0,
        }
      }
    },
    enabled: isLoggedIn && enabled,
    staleTime: STALE_TIME_FAVORITES,
    meta: { private: true },
    retry: false,
    select,
  })
}
