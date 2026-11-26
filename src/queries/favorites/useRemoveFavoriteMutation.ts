import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from 'api/api'
import {
  PaginatedResponseFavoriteArtistResponse,
  PaginatedResponseFavoriteOfferResponseV2,
  PaginatedResponseFavoriteVenueResponse,
} from 'api/gen'
import { useFavoritesTabViews } from 'features/favorites/context/FavoritesTabViewsProvider'
import { FavoriteType } from 'features/favorites/enum'
import { QueryKeys } from 'libs/queryKeys'

type FavoritesList = { favorites: { id: number }[]; nbFavorites: number }

type MutationContext<TList> = { previousFavorites?: TList }

type RemoveFavoriteProps<TList> = {
  onError?: (error?: Error, favoriteId?: number, context?: MutationContext<TList>) => void
  onSuccess?: (data?: unknown) => void
}

type RemoveFavoriteConfig = {
  type: FavoriteType
  queryKey: QueryKeys
  mutationFn: (favoriteId: number) => Promise<unknown>
}

const useRemoveFavoriteMutation = <TList extends FavoritesList>(
  { onError, onSuccess }: RemoveFavoriteProps<TList>,
  config: RemoveFavoriteConfig
) => {
  const queryClient = useQueryClient()
  const { removeUnviewedFavorite } = useFavoritesTabViews()
  const queryKey = [config.queryKey]

  return useMutation<unknown, Error, number, MutationContext<TList>>({
    mutationFn: config.mutationFn,
    onMutate: async (favoriteId) => {
      await queryClient.cancelQueries({ queryKey })

      // Snapshot the previous value
      const previousFavorites = queryClient.getQueryData<TList>(queryKey)

      // Optimistically update to the new value
      if (favoriteId && previousFavorites) {
        const favorites = previousFavorites.favorites.filter(
          (favorite) => favorite.id !== favoriteId
        )
        queryClient.setQueryData<TList>(queryKey, {
          ...previousFavorites,
          nbFavorites: favorites.length,
          favorites,
        })
      }

      return { previousFavorites }
    },
    onSuccess: (data, favoriteId) => {
      removeUnviewedFavorite(config.type, favoriteId)
      onSuccess?.(data)
    },
    onError: (error, favoriteId, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(queryKey, context.previousFavorites)
      }
      onError?.(error, favoriteId, context)
    },
  })
}

export const useRemoveOfferFavoriteMutation = (
  props: RemoveFavoriteProps<PaginatedResponseFavoriteOfferResponseV2>
) =>
  useRemoveFavoriteMutation<PaginatedResponseFavoriteOfferResponseV2>(props, {
    type: FavoriteType.OFFER,
    queryKey: QueryKeys.FAVORITES_OFFER,
    mutationFn: (favoriteId) => api.deleteNativeV2MeFavoritesOffersfavoriteId(favoriteId),
  })

export const useRemoveVenueFavoriteMutation = (
  props: RemoveFavoriteProps<PaginatedResponseFavoriteVenueResponse>
) =>
  useRemoveFavoriteMutation<PaginatedResponseFavoriteVenueResponse>(props, {
    type: FavoriteType.VENUE,
    queryKey: QueryKeys.FAVORITES_VENUE,
    mutationFn: (favoriteId) => api.deleteNativeV2MeFavoritesVenuesfavoriteId(favoriteId),
  })

export const useRemoveArtistFavoriteMutation = (
  props: RemoveFavoriteProps<PaginatedResponseFavoriteArtistResponse>
) =>
  useRemoveFavoriteMutation<PaginatedResponseFavoriteArtistResponse>(props, {
    type: FavoriteType.ARTIST,
    queryKey: QueryKeys.FAVORITES_ARTIST,
    mutationFn: (favoriteId) => api.deleteNativeV2MeFavoritesArtistsfavoriteId(favoriteId),
  })
