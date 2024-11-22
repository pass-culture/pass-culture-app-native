import { SearchResponse } from '@algolia/client-search'
import { useEffect } from 'react'
import { useQuery } from 'react-query'

import { fetchCinemaOffers } from 'features/search/pages/Search/ThematicSearch/Cinema/algolia/fetchCinemaOffers'
import { ThematicSearchPlaylistListProps } from 'features/search/pages/Search/ThematicSearch/ThematicSearchPlaylistList'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { useLocation } from 'libs/location'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'
import { Offer } from 'shared/offer/types'

export const CINEMA_PLAYLIST_TITLES = ['Films à l’affiche', 'Films de la semaine', 'Cartes ciné']

export function useCinemaOffers(): ThematicSearchPlaylistListProps {
  const netInfo = useNetInfoContext()
  const transformHits = useTransformOfferHits()

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

  if (!data || data.length === 0)
    return { playlists: [{ title: '', offers: { hits: [] } }], isLoading }

  return {
    playlists:
      data.length > 0
        ? data
            .map((item, index) => ({
              title: CINEMA_PLAYLIST_TITLES[index] || '',
              offers: { hits: item.hits.map(transformHits) },
            }))
            .filter((playlist) => playlist.offers.hits.length > 0)
        : [{ title: '', offers: { hits: [] } }],
    isLoading,
  }
}
