import { useMutation, useQuery } from 'react-query'

import { api } from 'api/api'
import { FavoriteRequest, PaginatedFavoritesResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'

export function useAddFavorite(onSuccess: () => void, onError: (error: unknown) => void) {
  return useMutation((body: FavoriteRequest) => api.postnativev1mefavorites(body), {
    onSuccess,
    onError,
  })
}

export function useFavorites() {
  const { isLoggedIn } = useAuthContext()

  return useQuery<PaginatedFavoritesResponse>('favorites', () => api.getnativev1mefavorites(), {
    enabled: isLoggedIn,
  })
}

export function useIsFavorite(offerId: number) {
  const { data } = useFavorites()
  if (!data) {
    return null
  }
  return !!data.favorites.find((favorite) => favorite.offer.id === offerId)
}
