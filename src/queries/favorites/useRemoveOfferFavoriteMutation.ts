import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from 'api/api'
import { PaginatedResponseFavoriteOfferResponseV2 } from 'api/gen'
import { FavoriteOfferMutationContext } from 'features/favorites/queries/types'
import { QueryKeys } from 'libs/queryKeys'

interface RemoveOfferFavorite {
  onError?: (error?: Error, favoriteId?: number, context?: FavoriteOfferMutationContext) => void
}

export const useRemoveOfferFavoriteMutation = ({ onError }: RemoveOfferFavorite) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (favoriteId: number) => api.deleteNativeV2MeFavoritesOffersfavoriteId(favoriteId),
    onMutate: async (favoriteId) => {
      await queryClient.cancelQueries({
        queryKey: [QueryKeys.FAVORITES_OFFER],
      })
      // Snapshot the previous value
      const previousFavorites = queryClient.getQueryData<PaginatedResponseFavoriteOfferResponseV2>([
        QueryKeys.FAVORITES_OFFER,
      ])

      // Optimistically update to the new value
      if (favoriteId && previousFavorites) {
        const favorites = previousFavorites.favorites.filter(
          (favorite) => favorite.id !== favoriteId
        )
        queryClient.setQueryData<PaginatedResponseFavoriteOfferResponseV2>(
          [QueryKeys.FAVORITES_OFFER],
          {
            ...previousFavorites,
            nbFavorites: favorites.length,
            favorites,
          }
        )
      }

      return { previousFavorites: previousFavorites ?? [] } as FavoriteOfferMutationContext
    },
    onError: (error: Error, favoriteId, context: FavoriteOfferMutationContext | undefined) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData([QueryKeys.FAVORITES_OFFER], context.previousFavorites)
      }
      if (onError) {
        onError(error, favoriteId, context)
      }
    },
  })
}
