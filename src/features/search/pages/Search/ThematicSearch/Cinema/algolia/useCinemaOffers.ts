import { SearchResponse } from 'instantsearch.js'
import { useQuery } from 'react-query'

import { fetchCinemaOffers } from 'features/search/pages/Search/ThematicSearch/Cinema/algolia/fetchCinemaOffers'
import { getMoviesOfTheWeek } from 'features/search/pages/Search/ThematicSearch/Cinema/utils'
import { useLocation } from 'libs/location'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'
import { Offer } from 'shared/offer/types'

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

  return {
    offers: data.map((item, index) => ({
      title: CINEMA_PLAYLIST_TITLES[index] ?? '',
      offers: data[index] ?? { hits: [] },
    })),
    isLoading,
  }
}
