import { FavoriteResponse } from 'api/gen'

import { useFavorites } from './useFavorites'

export function useFavorite({ offerId }: { offerId?: number }): FavoriteResponse | undefined {
  const { data } = useFavorites()
  const favorites = data?.favorites || []
  return favorites.find((favorite) => favorite.offer.id === offerId)
}
