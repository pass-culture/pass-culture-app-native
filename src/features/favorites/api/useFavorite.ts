import { FavoriteResponse } from 'api/gen'

import { useFavorites } from './useFavorites'

export function useFavorite({
  offerId,
}: {
  offerId?: number
}): FavoriteResponse | undefined | null {
  const { data, isLoading } = useFavorites()
  if (isLoading) return undefined
  const favorites = data?.favorites ?? []
  return favorites.find((favorite) => favorite.offer.id === offerId) ?? null
}
