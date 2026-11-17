import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from 'api/api'
import { PaginatedResponseFavoriteVenueResponse } from 'api/gen'
import { FavoriteVenueMutationContext } from 'features/favorites/queries/types'
import { QueryKeys } from 'libs/queryKeys'

interface RemoveVenueFavorite {
  onError?: (error?: Error, favoriteId?: number, context?: FavoriteVenueMutationContext) => void
}

export const useRemoveVenueFavoriteMutation = ({ onError }: RemoveVenueFavorite) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (favoriteId: number) => api.deleteNativeV2MeFavoritesVenuesfavoriteId(favoriteId),
    onMutate: async (favoriteId) => {
      await queryClient.cancelQueries({
        queryKey: [QueryKeys.FAVORITES_VENUE],
      })
      // Snapshot the previous value
      const previousFavorites = queryClient.getQueryData<PaginatedResponseFavoriteVenueResponse>([
        QueryKeys.FAVORITES_VENUE,
      ])

      // Optimistically update to the new value
      if (favoriteId && previousFavorites) {
        const favorites = previousFavorites.favorites.filter(
          (favorite) => favorite.id !== favoriteId
        )
        queryClient.setQueryData<PaginatedResponseFavoriteVenueResponse>(
          [QueryKeys.FAVORITES_VENUE],
          {
            ...previousFavorites,
            nbFavorites: favorites.length,
            favorites,
          }
        )
      }

      return { previousFavorites: previousFavorites ?? [] } as FavoriteVenueMutationContext
    },
    onError: (error: Error, favoriteId, context: FavoriteVenueMutationContext | undefined) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData([QueryKeys.FAVORITES_VENUE], context.previousFavorites)
      }
      if (onError) {
        onError(error, favoriteId, context)
      }
    },
  })
}
