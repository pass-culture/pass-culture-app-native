import { FavoriteResponse } from 'api/gen'
import {
  sortByAscendingPrice,
  sortByDistanceAroundMe,
  sortByIdDesc,
} from 'features/favorites/helpers/sorts'
import { FavoriteSortBy } from 'features/favorites/types'
import { Position } from 'libs/location/types'

export function applySortBy(list: FavoriteResponse[], sortBy: FavoriteSortBy, position: Position) {
  if (list.length === 0) return []

  const copiedList = [...list]
  switch (sortBy) {
    case 'ASCENDING_PRICE':
      return copiedList.sort(sortByAscendingPrice)
    case 'AROUND_ME':
      return position ? copiedList.sort(sortByDistanceAroundMe(position)) : copiedList
    case 'RECENTLY_ADDED':
      return copiedList.sort(sortByIdDesc)
    default:
      return copiedList
  }
}
