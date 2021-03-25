import { GeoCoordinates } from 'react-native-geolocation-service'
import { QueryFunctionContext, useInfiniteQuery } from 'react-query'

import { FavoriteResponse, PaginatedFavoritesResponse } from 'api/gen'
import { FavoriteSortBy } from 'features/favorites/pages/FavoritesSorts'
import { useFavorites } from 'features/favorites/pages/useFavorites'
import {
  sortByAscendingPrice,
  sortByDistanceAroundMe,
  sortByIdDesc,
} from 'features/favorites/pages/utils/sorts'
import { useGeolocation } from 'libs/geolocation'

import { useFavoritesState } from './FavoritesWrapper'
import { FavoritesState } from './reducer'

export interface FakePaginatedFavoritesOptions {
  page: number
  favoritesPerPage: number
  sortBy: FavoriteSortBy
  position: GeoCoordinates | null
}

export interface FakePaginatedFavoritesResponse {
  favorites: Array<FavoriteResponse>
  page: number
  nbFavorites: number
  nbPages: number
  favoritesPerPage: number
}

function applyFilter(
  list: Array<FavoriteResponse>,
  sortBy: FavoriteSortBy,
  position: GeoCoordinates | null
) {
  if (sortBy === 'ASCENDING_PRICE') {
    list.sort(sortByAscendingPrice)
    return list
  } else if (sortBy === 'AROUND_ME') {
    list.sort(sortByDistanceAroundMe(position))
    return list
  } else if (sortBy === 'RECENTLY_ADDED') {
    list.sort(sortByIdDesc)
    return list
  } else {
    return list
  }
}

/** Fetch the user's full list of favorites and paginate it for UI concerns */
export const getPaginatedFavorites = async (
  data: PaginatedFavoritesResponse | undefined,
  options: FakePaginatedFavoritesOptions
) => {
  const { favorites } = data || { nbFavorites: 0, favorites: [] }

  const sortedFavorites = !options.sortBy
    ? favorites
    : applyFilter(favorites, options.sortBy, options.position)

  return {
    favorites: sortedFavorites.slice(
      options.page * options.favoritesPerPage,
      (options.page + 1) * options.favoritesPerPage
    ),
    page: options.page,
    nbFavorites: sortedFavorites.length,
    nbPages: Math.ceil(sortedFavorites.length / options.favoritesPerPage),
    favoritesPerPage: options.favoritesPerPage,
  }
}

const useFavoritesInfiniteQuery = (
  data: PaginatedFavoritesResponse | undefined,
  favoritesParameters: FavoritesState,
  position: GeoCoordinates | null
) =>
  useInfiniteQuery<FakePaginatedFavoritesResponse>(
    ['favoritesResults', favoritesParameters],
    async (context: QueryFunctionContext<[string, FavoritesState], number>) =>
      await getPaginatedFavorites(data, {
        position,
        page: context.pageParam || 0,
        favoritesPerPage: 20,
        ...context.queryKey[1],
      }),
    {
      getNextPageParam: ({ page, nbPages }) => (page < nbPages ? page + 1 : undefined),
    }
  )

export const useFavoritesResults = () => {
  const { data } = useFavorites()
  const favoritesParameters = useFavoritesState()
  const { position } = useGeolocation()
  return useFavoritesInfiniteQuery(data, favoritesParameters, position)
}
