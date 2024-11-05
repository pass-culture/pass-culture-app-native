import { SearchResponse } from 'instantsearch.js'
import { useQuery } from 'react-query'

import { fetchCinemaOffers } from 'features/search/pages/Search/SearchN1/category/Cinema/algolia/fetchCinemaOffers'
import { getMoviesOfTheWeek } from 'features/search/pages/Search/SearchN1/category/Cinema/utils'
import { useLocation } from 'libs/location'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'
import { Offer } from 'shared/offer/types'

export type CinemaPlaylistData = {
  title: string
  offers: { hits: Offer[] }
}

const CINEMA_PLAYLIST_TITLES = ['Films à l’affiche', 'Films de la semaine', 'Cartes ciné']

export function useCinemaOffers() {
  const netInfo = useNetInfoContext()
  const { userLocation } = useLocation()
  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.CINEMA_OFFERS],
    queryFn: async (): Promise<SearchResponse<Offer>[]> => {
      return fetchCinemaOffers({ userLocation })
    },
    enabled: !!netInfo.isConnected,
    staleTime: 5 * 60 * 1000,
  })
  if (!data || data.length === 0) return { offers: [], isLoading }

  let offers: (SearchResponse<Offer> | undefined)[] = data
  const [moviesCurrentlyAvailable, moviesCurrentlyAvailableWithReleaseDateAttribute, ...cineCards] =
    offers

  if (moviesCurrentlyAvailableWithReleaseDateAttribute?.hits.length) {
    const moviesOfTheWeek = getMoviesOfTheWeek(moviesCurrentlyAvailableWithReleaseDateAttribute)
    offers = [moviesCurrentlyAvailable, moviesOfTheWeek, ...cineCards]
  }
  return {
    offers: offers.map((item, index) => ({
      title: CINEMA_PLAYLIST_TITLES[index] ?? '',
      offers: offers[index] ?? { hits: [] },
    })),
    isLoading,
  }
}
