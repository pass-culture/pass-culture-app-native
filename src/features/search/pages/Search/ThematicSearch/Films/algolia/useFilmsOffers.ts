import { SearchResponse } from 'instantsearch.js'
import { useQuery } from 'react-query'

import { fetchFilmsOffers } from 'features/search/pages/Search/ThematicSearch/Films/algolia/fetchFilmsOffers'
import { ThematicSearchPlaylistData } from 'features/search/pages/Search/ThematicSearch/types'
import { useLocation } from 'libs/location'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'
import { Offer } from 'shared/offer/types'

const FILMS_PLAYLIST_TITLES = ['Vidéos et documentaires', 'DVD et Blu-ray', 'Abonnements streaming']

type FilmsOffersData = {
  offers: ThematicSearchPlaylistData[]
  isLoading: boolean
}
export function useFilmsOffers(): FilmsOffersData {
  const netInfo = useNetInfoContext()

  const { userLocation } = useLocation()
  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.FILMS_OFFERS],
    queryFn: async (): Promise<SearchResponse<Offer>[]> => {
      return fetchFilmsOffers({ userLocation })
    },
    enabled: !!netInfo.isConnected,
    staleTime: 5 * 60 * 1000,
  })

  if (!data || data.length === 0) return { offers: [], isLoading }

  return {
    offers: data.map((item, index) => ({
      title: FILMS_PLAYLIST_TITLES[index] ?? '',
      offers: data[index] ?? { hits: [] },
    })),
    isLoading,
  }
}
