import { SearchResponse } from 'instantsearch.js'
import { useEffect } from 'react'
import { useQuery } from 'react-query'

import { fetchCinemaOffers } from 'features/search/pages/Search/ThematicSearch/Cinema/algolia/fetchCinemaOffers'
import { useLocation } from 'libs/location'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'
import { Offer } from 'shared/offer/types'

const CINEMA_PLAYLIST_TITLES = ['Films à l’affiche', 'Films de la semaine', 'Cartes ciné']

export function useCinemaOffers() {
  const netInfo = useNetInfoContext()

  const { userLocation } = useLocation()
  const { data, isLoading, refetch } = useQuery({
    queryKey: [QueryKeys.CINEMA_OFFERS],
    queryFn: async (): Promise<SearchResponse<Offer>[]> => {
      return fetchCinemaOffers({ userLocation })
    },
    enabled: !!netInfo.isConnected,
    staleTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    // When we enable, disable or change the location, we want to refetch the playlists
    refetch().catch(() => {
      return
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation?.latitude, userLocation?.longitude])

  if (!data || data.length === 0) return { offers: [], isLoading }

  return {
    offers: data.map((item, index) => ({
      title: CINEMA_PLAYLIST_TITLES[index] ?? '',
      offers: data[index] ?? { hits: [] },
    })),
    isLoading,
  }
}
