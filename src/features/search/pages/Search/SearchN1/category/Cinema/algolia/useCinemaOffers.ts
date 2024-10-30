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
    queryFn: async (): Promise<CinemaPlaylistData[]> => {
      const [
        moviesCurrentlyAvailable,
        moviesCurrentlyAvailableWithReleaseDateAttribute,
        ...cineCards
      ] = await fetchCinemaOffers({
        userLocation,
      })
      let offers = [
        moviesCurrentlyAvailable,
        moviesCurrentlyAvailableWithReleaseDateAttribute,
        ...cineCards,
      ]
      if (moviesCurrentlyAvailableWithReleaseDateAttribute?.hits.length) {
        const moviesOfTheWeek = getMoviesOfTheWeek(moviesCurrentlyAvailableWithReleaseDateAttribute)
        offers = [moviesCurrentlyAvailable, moviesOfTheWeek, ...cineCards]
      }
      return offers.map((item, index) => ({
        title: CINEMA_PLAYLIST_TITLES[index] ?? '',
        offers: offers[index] ?? { hits: [] },
      }))
    },
    enabled: !!netInfo.isConnected,
    staleTime: 5 * 60 * 1000,
  })

  return {
    offers: data,
    isLoading,
  }
}
