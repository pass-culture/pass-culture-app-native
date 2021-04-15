import { useMutation, useQuery, useQueryClient } from 'react-query'

import { api } from 'api/api'
import { FavoriteRequest, FavoriteResponse, PaginatedFavoritesResponse } from 'api/gen'
import { ApiError } from 'api/helpers'
import { useAuthContext } from 'features/auth/AuthContext'
import { EmptyResponse } from 'libs/fetch'
import { QueryKeys } from 'libs/queryKeys'

export interface FavoriteMutationContext {
  previousFavorites: Array<FavoriteResponse>
}

export interface AddFavorite {
  onSuccess?: (data?: FavoriteResponse) => void
  onError?: (
    error: Error | ApiError | undefined,
    { offerId }: { offerId?: number },
    context?: FavoriteMutationContext
  ) => void
  onMutate?: ({ offerId }: { offerId?: number }) => FavoriteMutationContext | void
  onSettled?: (data: FavoriteResponse | undefined, error?: Error | null) => void
}

export interface RemoveFavorite {
  onSuccess?: (data?: EmptyResponse) => void
  onError?: (error?: Error, favoriteId?: number, context?: FavoriteMutationContext) => void
  onMutate?: (favoriteId?: number | undefined) => FavoriteMutationContext | void
  onSettled?: (data: EmptyResponse | undefined, error?: Error | null) => void
}

export function useRemoveFavorite({ onSuccess, onError, onMutate, onSettled }: RemoveFavorite) {
  const queryClient = useQueryClient()
  return useMutation(
    'removeFavorite',
    (favoriteId: number) => api.deletenativev1mefavoritesfavoriteId(favoriteId),
    {
      onSuccess,
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

        if (onMutate) {
          onMutate(favoriteId)
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
      onSettled: (data) => {
        if (onSettled) {
          onSettled(data)
        }
      },
    }
  )
}

export function useAddFavorite({ onSuccess, onError, onMutate, onSettled }: AddFavorite) {
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
          { id: Math.random(), offer: { id: offerId, category: {} } },
        ]

        queryClient.setQueryData(QueryKeys.FAVORITES, {
          ...previousFavorites,
          nbFavorites: favorites.length,
          favorites,
        })
      }

      if (onMutate) {
        onMutate({ offerId })
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
    onSettled: (data) => {
      if (onSettled) {
        onSettled(data)
      }
    },
  })
}

export function useFavorites() {
  const { isLoggedIn } = useAuthContext()

  return useQuery<PaginatedFavoritesResponse>(
    QueryKeys.FAVORITES,
    () => api.getnativev1mefavorites(),
    {
      enabled: isLoggedIn,
    }
  )
}

export function useFavorite({ offerId, id }: { offerId?: number; id?: number }) {
  const { data } = useFavorites()
  if (!data) {
    return null
  }

  return data.favorites.find((favorite) => {
    if (
      (offerId && id && favorite.offer.id === offerId && favorite.id === id) ||
      (!id && favorite.offer.id === offerId) ||
      (!offerId && favorite.id === id)
    ) {
      return true
    }
    return false
  })
}
