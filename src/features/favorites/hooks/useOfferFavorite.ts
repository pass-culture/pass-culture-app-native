import { FavoriteResponse } from 'api/gen'

import { useOfferFavoritesQuery } from '../queries/useOfferFavoritesQuery'

export const useOfferFavorite = ({
  offerId,
}: {
  offerId?: number
}): FavoriteResponse | undefined | null => {
  const { data, isLoading } = useOfferFavoritesQuery()
  if (isLoading) return undefined
  const favorites = data?.favorites ?? []
  return favorites.find((favorite) => favorite.offer.id === offerId) ?? null
}
