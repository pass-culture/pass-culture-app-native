// features/favorites/queries/useArtistFavoritesQuery.ts
import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { PaginatedResponseFavoriteArtistResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME_FAVORITES = 5 * 60 * 1000

type UseArtistFavoritesQueryOptions<TData = PaginatedResponseFavoriteArtistResponse> = {
  enabled?: boolean
  select?: (data: PaginatedResponseFavoriteArtistResponse) => TData
}

export const useArtistFavoritesQuery = <TData = PaginatedResponseFavoriteArtistResponse>({
  enabled = true,
  select,
}: UseArtistFavoritesQueryOptions<TData> = {}) => {
  const { isLoggedIn } = useAuthContext()

  return useQuery({
    queryKey: [QueryKeys.FAVORITES_ARTIST],
    queryFn: async () => {
      try {
        return await api.getNativeV2MeFavoritesArtists()
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
