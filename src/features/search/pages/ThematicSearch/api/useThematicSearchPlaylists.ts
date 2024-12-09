import { SearchResponse } from 'instantsearch.js'
import { useEffect } from 'react'
import { useQuery } from 'react-query'

import { ThematicSearchPlaylistListProps } from 'features/search/pages/ThematicSearch/ThematicSearchPlaylistList'
import { filterOfferHit, useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { Position, useLocation } from 'libs/location'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { Offer } from 'shared/offer/types'

type ThematicSearchPlaylists = {
  playlistTitles: string[]
  fetchMethod: (userLocation: Position) => Promise<SearchResponse<Offer>[]>
  queryKey: string
}

export function useThematicSearchPlaylists({
  playlistTitles,
  fetchMethod,
  queryKey,
}: ThematicSearchPlaylists): ThematicSearchPlaylistListProps {
  const transformHits = useTransformOfferHits()

  const netInfo = useNetInfoContext()

  const { userLocation } = useLocation()
  const { data, refetch, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: async (): Promise<SearchResponse<Offer>[]> => {
      return fetchMethod(userLocation)
    },
    enabled: !!netInfo.isConnected && !!netInfo.isInternetReachable,
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
              title: playlistTitles[index] || '',
              offers: { hits: item.hits.filter(filterOfferHit).map(transformHits) },
            }))
            .filter((playlist) => playlist.offers.hits.length > 0)
        : [{ title: '', offers: { hits: [] } }],
    isLoading,
  }
}
