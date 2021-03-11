import { QueryFunctionContext, useInfiniteQuery } from 'react-query'

import { FavoriteResponse, PaginatedFavoritesResponse } from 'api/gen'
import { useFavorites } from 'features/favorites/pages/useFavorites'

import { useFavoritesState } from './FavoritesWrapper'
import { FavoritesParameters } from './reducer'

export interface FakePaginatedFavoritesOptions {
  page: number
  favoritesPerPage: number
}

export interface FakePaginatedFavoritesResponse {
  favorites: Array<FavoriteResponse>
  page: number
  nbFavorites: number
  nbPages: number
  favoritesPerPage: number
}

/** Fetch the user's full list of favorites and paginate it for UI concerns */
export const getPaginatedFavorites = async (
  data: PaginatedFavoritesResponse | undefined,
  options: FakePaginatedFavoritesOptions
) => {
  const { nbFavorites, favorites } = data || { nbFavorites: 0, favorites: [] }
  return {
    favorites: favorites.slice(
      options.page * options.favoritesPerPage,
      (options.page + 1) * options.favoritesPerPage
    ),
    page: options.page,
    nbFavorites: nbFavorites,
    nbPages: Math.ceil(nbFavorites / options.favoritesPerPage),
    favoritesPerPage: options.favoritesPerPage,
  }
}

const useFavoritesInfiniteQuery = (
  data: PaginatedFavoritesResponse | undefined,
  favoritesParameters: FavoritesParameters
) =>
  useInfiniteQuery<FakePaginatedFavoritesResponse>(
    ['favoritesResults', favoritesParameters],
    async (context: QueryFunctionContext<[string, FavoritesParameters], number>) =>
      await getPaginatedFavorites(data, {
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
  const { showResults: _showResults, ...favoritesParameters } = useFavoritesState()
  return useFavoritesInfiniteQuery(data, favoritesParameters)
}
