import { FavoriteResponse } from 'api/gen'

import { useFavoritesQuery } from '../queries/useFavoritesQuery'

export const useFavorite = ({
  offerId,
}: {
  offerId?: number
}): FavoriteResponse | undefined | null => {
  const { data, isInitialLoading: isLoading } = useFavoritesQuery()
  if (isLoading) return undefined
  const favorites = data?.favorites ?? []
  return favorites.find((favorite) => favorite.offer.id === offerId) ?? null
}
