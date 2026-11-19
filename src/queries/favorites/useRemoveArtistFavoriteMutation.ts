import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from 'api/api'
import { PaginatedResponseFavoriteArtistResponse } from 'api/gen'
import { FavoriteArtistMutationContext } from 'features/favorites/queries/types'
import { QueryKeys } from 'libs/queryKeys'

interface RemoveArtistFavorite {
  onError?: (error?: Error, favoriteId?: number, context?: FavoriteArtistMutationContext) => void
}

export const useRemoveArtistFavoriteMutation = ({ onError }: RemoveArtistFavorite) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (favoriteId: number) => api.deleteNativeV2MeFavoritesArtistsfavoriteId(favoriteId),
    onMutate: async (favoriteId) => {
      await queryClient.cancelQueries({
        queryKey: [QueryKeys.FAVORITES_ARTIST],
      })
      // Snapshot the previous value
      const previousFavorites = queryClient.getQueryData<PaginatedResponseFavoriteArtistResponse>([
        QueryKeys.FAVORITES_ARTIST,
      ])

      // Optimistically update to the new value
      if (favoriteId && previousFavorites) {
        const favorites = previousFavorites.favorites.filter(
          (favorite) => favorite.id !== favoriteId
        )
        queryClient.setQueryData<PaginatedResponseFavoriteArtistResponse>(
          [QueryKeys.FAVORITES_ARTIST],
          {
            ...previousFavorites,
            nbFavorites: favorites.length,
            favorites,
          }
        )
      }

      return { previousFavorites: previousFavorites ?? [] } as FavoriteArtistMutationContext
    },
    onError: (error: Error, favoriteId, context: FavoriteArtistMutationContext | undefined) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData([QueryKeys.FAVORITES_ARTIST], context.previousFavorites)
      }
      if (onError) {
        onError(error, favoriteId, context)
      }
    },
  })
}
