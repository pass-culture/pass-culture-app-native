import { useMutation, useQuery, useQueryClient } from 'react-query'

import { api } from 'api/api'
import { ApiError } from 'api/apiHelpers'
import {
  FavoriteRequest,
  FavoriteResponse,
  FavoritesCountResponse,
  PaginatedFavoritesResponse,
  SubcategoryIdEnum,
} from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

export interface FavoriteMutationContext {
  previousFavorites: Array<FavoriteResponse>
}

interface RemoveFavorite {
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
        queryClient.setQueryData(QueryKeys.FAVORITES_COUNT, { count: favorites.length })
      }

      return { previousFavorites: previousFavorites || [] } as FavoriteMutationContext
    },
    onError: (error: Error, favoriteId, context: FavoriteMutationContext | undefined) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(QueryKeys.FAVORITES, context.previousFavorites)
        queryClient.setQueryData(QueryKeys.FAVORITES_COUNT, {
          count: context.previousFavorites.length,
        })
      }
      if (onError) {
        onError(error, favoriteId, context)
      }
    },
  })
}

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

// arbitrary. We have to make sure we invalidate the cache when adding/removing favorites. See above
const STALE_TIME_FAVORITES = 5 * 60 * 1000

export function useFavorites() {
  const netInfo = useNetInfoContext()
  const { isLoggedIn } = useAuthContext()

  return useQuery<PaginatedFavoritesResponse>(
    QueryKeys.FAVORITES,
    () => api.getnativev1mefavorites(),
    { enabled: !!netInfo.isConnected && isLoggedIn, staleTime: STALE_TIME_FAVORITES }
  )
}

export function useFavoritesCount() {
  const { isLoggedIn } = useAuthContext()
  const netInfo = useNetInfoContext()

  return useQuery(QueryKeys.FAVORITES_COUNT, () => api.getnativev1mefavoritescount(), {
    enabled: !!netInfo.isConnected && isLoggedIn,
    staleTime: STALE_TIME_FAVORITES,
    select: (data: FavoritesCountResponse) => data.count,
  })
}

export function useFavorite({ offerId }: { offerId?: number }): FavoriteResponse | undefined {
  const { data } = useFavorites()
  const favorites = data?.favorites || []
  return favorites.find((favorite) => favorite.offer.id === offerId)
}
