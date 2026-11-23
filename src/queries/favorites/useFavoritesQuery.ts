import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import {
  PaginatedResponseFavoriteArtistResponse,
  PaginatedResponseFavoriteOfferResponseV2,
  PaginatedResponseFavoriteVenueResponse,
} from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { QueryKeys } from 'libs/queryKeys'

// arbitrary. We have to make sure we invalidate the cache when adding/removing favorites.
const STALE_TIME_FAVORITES = 5 * 60 * 1000

type FavoritesQueryOptions<TList, TData = TList> = {
  enabled?: boolean
  select?: (data: TList) => TData
}

const useFavoritesQuery = <TList, TData = TList>(
  { queryKey, queryFn }: { queryKey: QueryKeys; queryFn: () => Promise<TList> },
  { enabled = true, select }: FavoritesQueryOptions<TList, TData> = {}
) => {
  const { isLoggedIn } = useAuthContext()

  return useQuery({
    queryKey: [queryKey],
    queryFn,
    enabled: isLoggedIn && enabled,
    staleTime: STALE_TIME_FAVORITES,
    meta: { private: true },
    select,
  })
}

export const useOfferFavoritesQuery = <TData = PaginatedResponseFavoriteOfferResponseV2>(
  options?: FavoritesQueryOptions<PaginatedResponseFavoriteOfferResponseV2, TData>
) =>
  useFavoritesQuery(
    { queryKey: QueryKeys.FAVORITES_OFFER, queryFn: () => api.getNativeV2MeFavoritesOffers() },
    options
  )

export const useArtistFavoritesQuery = <TData = PaginatedResponseFavoriteArtistResponse>(
  options?: FavoritesQueryOptions<PaginatedResponseFavoriteArtistResponse, TData>
) =>
  useFavoritesQuery(
    { queryKey: QueryKeys.FAVORITES_ARTIST, queryFn: () => api.getNativeV2MeFavoritesArtists() },
    options
  )

export const useVenueFavoritesQuery = <TData = PaginatedResponseFavoriteVenueResponse>(
  options?: FavoritesQueryOptions<PaginatedResponseFavoriteVenueResponse, TData>
) =>
  useFavoritesQuery(
    { queryKey: QueryKeys.FAVORITES_VENUE, queryFn: () => api.getNativeV2MeFavoritesVenues() },
    options
  )
