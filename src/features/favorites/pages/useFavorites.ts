import { useMutation, useQuery, useQueryClient } from 'react-query'

import { api } from 'api/api'
import { ApiError } from 'api/apiHelpers'
import {
  FavoriteRequest,
  FavoriteResponse,
  PaginatedFavoritesResponse,
  SubcategoryIdEnum,
} from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { QueryKeys } from 'libs/queryKeys'

export interface FavoriteMutationContext {
  previousFavorites: Array<FavoriteResponse>
}

export interface RemoveFavorite {
  onError?: (error?: Error, favoriteId?: number, context?: FavoriteMutationContext) => void
}

export function useRemoveFavorite({ onError }: RemoveFavorite) {
  const queryClient = useQueryClient()

  return useMutation((favoriteId: number) => api.deletenativev1mefavoritesfavoriteId(favoriteId), {
    onMutate: async (favoriteId) => {
      await queryClient.cancelQueries(QueryKeys.FAVORITES)
      // Snapshot the previous value
      const previousFavorites = queryClient.getQueryData<PaginatedFavoritesResponse>(
        QueryKeys.FAVORITES
      )

      // Optimistically update to the new value
      if (favoriteId && previousFavorites) {
        const favorites = previousFavorites.favorites.filter(
          (favorite) => favorite.id !== favoriteId
        )
        queryClient.setQueryData<PaginatedFavoritesResponse>(QueryKeys.FAVORITES, {
          ...previousFavorites,
          nbFavorites: favorites.length,
          favorites,
        })
      }

      return { previousFavorites: previousFavorites || [] } as FavoriteMutationContext
    },
    onError: (error: Error, favoriteId, context: FavoriteMutationContext | undefined) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(QueryKeys.FAVORITES, context.previousFavorites)
      }
      if (onError) {
        onError(error, favoriteId, context)
      }
    },
  })
}

export interface AddFavorite {
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
        queryClient.setQueryData(QueryKeys.FAVORITES, {
          ...previousFavorites,
          favorites: [
            ...previousFavorites.favorites.filter((favoris) => favoris.offer.id !== data.offer.id),
            data,
          ],
        })
      } else {
        queryClient.invalidateQueries(QueryKeys.FAVORITES)
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
            offer: { id: offerId, subcategoryId: SubcategoryIdEnum.ABOBIBLIOTHEQUE },
          },
        ]

        queryClient.setQueryData(QueryKeys.FAVORITES, {
          ...previousFavorites,
          nbFavorites: favorites.length,
          favorites,
        })
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
      }
      if (onError) {
        onError(error, { offerId }, context)
      }
    },
  })
}

// arbitrary. We have to make sure we invalidate the cache when adding/removing favorites. See above
const STALE_TIME_FAVORITES = 5 * 60 * 1000

export function useFavorites() {
  const { isLoggedIn } = useAuthContext()

  return useQuery<PaginatedFavoritesResponse>(
    QueryKeys.FAVORITES,
    () => api.getnativev1mefavorites(),
    { enabled: isLoggedIn, staleTime: STALE_TIME_FAVORITES }
  )
}

export function useFavorite({ offerId }: { offerId?: number }): FavoriteResponse | undefined {
  const { data } = useFavorites()
  const favorites = data?.favorites || []
  return favorites.find((favorite) => favorite.offer.id === offerId)
}
