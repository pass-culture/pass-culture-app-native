import { useMutation, useQueryClient } from 'react-query'

import { api } from 'api/api'
import { ApiError } from 'api/apiHelpers'
import {
  FavoriteRequest,
  FavoriteResponse,
  PaginatedFavoritesResponse,
  SubcategoryIdEnum,
} from 'api/gen'
import { FavoriteMutationContext } from 'features/favorites/api/types'
import { QueryKeys } from 'libs/queryKeys'

interface AddFavorite {
  onSuccess?: (data?: FavoriteResponse) => void
  onError?: (
    error: Error | ApiError | undefined,
    { offerId }: { offerId?: number },
    context?: FavoriteMutationContext
  ) => void
}

export function useAddFavorite({ onSuccess, onError }: AddFavorite) {
  const queryClient = useQueryClient()

  return useMutation((body: FavoriteRequest) => api.postnativev1mefavorites(body), {
    onSuccess: (data: FavoriteResponse) => {
      const previousFavorites = queryClient.getQueryData<PaginatedFavoritesResponse>(
        QueryKeys.FAVORITES
      )

      if (previousFavorites) {
        const favorites = [
          ...previousFavorites.favorites.filter((favoris) => favoris.offer.id !== data.offer.id),
          data,
        ]
        queryClient.setQueryData(QueryKeys.FAVORITES, { ...previousFavorites, favorites })
        queryClient.setQueryData(QueryKeys.FAVORITES_COUNT, { count: favorites.length })
      } else {
        queryClient.invalidateQueries(QueryKeys.FAVORITES)
        queryClient.invalidateQueries(QueryKeys.FAVORITES_COUNT)
      }
      if (onSuccess) {
        onSuccess(data)
      }
    },
    onMutate: ({ offerId }) => {
      const previousFavorites = queryClient.getQueryData<PaginatedFavoritesResponse>(
        QueryKeys.FAVORITES
      )
      if (previousFavorites) {
        const favorites = [
          ...previousFavorites.favorites,
          {
            id: Math.random(),
            // Using a random subcategory so that it doesn't crash
            offer: { id: offerId, subcategoryId: SubcategoryIdEnum.ABO_BIBLIOTHEQUE },
          },
        ]

        queryClient.setQueryData(QueryKeys.FAVORITES, {
          ...previousFavorites,
          nbFavorites: favorites.length,
          favorites,
        })
        queryClient.setQueryData(QueryKeys.FAVORITES_COUNT, { count: favorites.length })
      }

      return { previousFavorites: previousFavorites || [] } as FavoriteMutationContext
    },
    onError: (
      error: Error | ApiError,
      { offerId },
      context: FavoriteMutationContext | undefined
    ) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(QueryKeys.FAVORITES, context.previousFavorites)
        queryClient.setQueryData(QueryKeys.FAVORITES_COUNT, {
          count: context.previousFavorites.length,
        })
      }
      if (onError) {
        onError(error, { offerId }, context)
      }
    },
  })
}
