import { useMutation, useQueryClient } from 'react-query'

import { api } from 'api/api'
import { PaginatedFavoritesResponse } from 'api/gen'
import { FavoriteMutationContext } from 'features/favorites/api/types'
import { QueryKeys } from 'libs/queryKeys'

interface RemoveFavorite {
  onError?: (error?: Error, favoriteId?: number, context?: FavoriteMutationContext) => void
}

export function useRemoveFavorite({ onError }: RemoveFavorite) {
  const queryClient = useQueryClient()

  return useMutation((favoriteId: number) => api.deletenativev1mefavoritesfavoriteId(favoriteId), {
    onMutate: async (favoriteId) => {
      await queryClient.cancelQueries([QueryKeys.FAVORITES])
      // Snapshot the previous value
      const previousFavorites = queryClient.getQueryData<PaginatedFavoritesResponse>([
        QueryKeys.FAVORITES,
      ])

      // Optimistically update to the new value
      if (favoriteId && previousFavorites) {
        const favorites = previousFavorites.favorites.filter(
          (favorite) => favorite.id !== favoriteId
        )
        queryClient.setQueryData<PaginatedFavoritesResponse>([QueryKeys.FAVORITES], {
          ...previousFavorites,
          nbFavorites: favorites.length,
          favorites,
        })
        queryClient.setQueryData([QueryKeys.FAVORITES_COUNT], { count: favorites.length })
      }

      return { previousFavorites: previousFavorites || [] } as FavoriteMutationContext
    },
    onError: (error: Error, favoriteId, context: FavoriteMutationContext | undefined) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData([QueryKeys.FAVORITES], context.previousFavorites)
        queryClient.setQueryData([QueryKeys.FAVORITES_COUNT], {
          count: context.previousFavorites.length,
        })
      }
      if (onError) {
        onError(error, favoriteId, context)
      }
    },
  })
}
