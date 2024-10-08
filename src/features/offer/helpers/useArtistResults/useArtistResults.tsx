import { Hit } from '@algolia/client-search'
import { useCallback, useMemo } from 'react'
import { useQuery } from 'react-query'

import { SearchGroupNameEnumv2 } from 'api/gen'
import {
  HitOfferWithArtistAndEan,
  fetchOffersByArtist,
} from 'features/offer/api/fetchOffersByArtist/fetchOffersByArtist'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { useLocation } from 'libs/location'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { formatDistance } from 'libs/parsers/formatDistance'
import { QueryKeys } from 'libs/queryKeys'

type UseArtistResultsProps = {
  searchGroupName: SearchGroupNameEnumv2
  artists?: string | null
}

export const useArtistResults = ({ artists, searchGroupName }: UseArtistResultsProps) => {
  const netInfo = useNetInfoContext()
  const transformHits = useTransformOfferHits()
  const { userLocation } = useLocation()

  const { data } = useQuery(
    [QueryKeys.ARTIST_PLAYLIST, artists],
    async () => {
      const { playlistHits, topOffersHits } = await fetchOffersByArtist({
        artists,
        searchGroupName,
        userLocation,
      })
      return { playlistHits, topOffersHits }
    },
    { enabled: !!netInfo.isConnected, initialData: { playlistHits: [], topOffersHits: [] } }
  )

  const getSortedHits = useCallback(
    (hits: Hit<HitOfferWithArtistAndEan>[]) => {
      if (hits.length === 0) return []

      const transformedHitsWithDistance = hits.map((hit) => {
        const transformedHit = transformHits(hit)
        const distance = formatDistance(
          { lat: hit._geoloc.lat, lng: hit._geoloc.lng },
          userLocation
        )

        return { ...transformedHit, distance: parseDistance(distance || '0') }
      })

      const sortedHits = [...transformedHitsWithDistance].sort((a, b) => a.distance - b.distance)

      return sortedHits.map(
        ({ distance: _distance, ...rest }) => rest
      ) as HitOfferWithArtistAndEan[]
    },
    [transformHits, userLocation]
  )

  const artistPlaylist = useMemo(() => {
    if (!data?.playlistHits) return []
    return getSortedHits(data.playlistHits)
  }, [data?.playlistHits, getSortedHits])

  const artistTopOffers = useMemo(() => {
    if (!data?.topOffersHits) return []
    return getSortedHits(data.topOffersHits)
  }, [data?.topOffersHits, getSortedHits])

  return { artistPlaylist, artistTopOffers }
}

const parseDistance = (distance: string) => {
  if (distance.includes('km')) {
    // Convert kilometers to meters
    return parseFloat(distance) * 1000
  }

  return parseFloat(distance)
}
