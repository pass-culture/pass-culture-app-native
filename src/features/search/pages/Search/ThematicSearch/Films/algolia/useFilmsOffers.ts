import { SearchResponse } from 'instantsearch.js'
import { useEffect } from 'react'
import { useQuery } from 'react-query'

import { fetchFilmsOffers } from 'features/search/pages/Search/ThematicSearch/Films/algolia/fetchFilmsOffers'
import { ThematicSearchPlaylistListProps } from 'features/search/pages/Search/ThematicSearch/ThematicSearchPlaylistList'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { useLocation } from 'libs/location'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'
import { Offer } from 'shared/offer/types'

const FILMS_PLAYLIST_TITLES = ['Vidéos et documentaires', 'DVD et Blu-ray', 'Abonnements streaming']

export function useFilmsOffers(): ThematicSearchPlaylistListProps {
  const transformHits = useTransformOfferHits()

  const netInfo = useNetInfoContext()

  const { userLocation } = useLocation()
  const { data, refetch, isLoading } = useQuery({
    queryKey: [QueryKeys.FILMS_OFFERS],
    queryFn: async (): Promise<SearchResponse<Offer>[]> => {
      return fetchFilmsOffers({ userLocation })
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
              title: FILMS_PLAYLIST_TITLES[index] || '',
              offers: { hits: item.hits.map(transformHits) },
            }))
            .filter((playlist) => playlist.offers.hits.length > 0)
        : [{ title: '', offers: { hits: [] } }],
    isLoading,
  }
}
