import { UseQueryResult } from 'react-query'

import { FavoriteResponse, PaginatedFavoritesResponse } from 'api/gen'
import { useFavoritesQuery } from 'features/favorites/api/useFavoritesQuery'

export const useFavoriteQuery = ({
  offerId,
}: {
  offerId?: number
}): UseQueryResult<FavoriteResponse | null, unknown> =>
  useFavoritesQuery((data) => getFavoriteFromId(data, offerId))

export const useFavoriteCount = () => useFavoritesQuery(getFavoriteCount)

const getFavoriteFromId = (
  data: PaginatedFavoritesResponse | undefined,
  offerId: number | undefined
): FavoriteResponse | null => {
  return data?.favorites.find((favorite) => favorite.offer.id === offerId) ?? null
}

const getFavoriteCount = (data: PaginatedFavoritesResponse | undefined) => data?.nbFavorites ?? 0
