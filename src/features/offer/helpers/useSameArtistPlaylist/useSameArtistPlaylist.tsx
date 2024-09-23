import { useMemo } from 'react'
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

type UseSameArtistPlaylistProps = {
  searchGroupName: SearchGroupNameEnumv2
  artists?: string | null
}

export const useSameArtistPlaylist = ({ artists, searchGroupName }: UseSameArtistPlaylistProps) => {
  const netInfo = useNetInfoContext()
  const transformHits = useTransformOfferHits()
  const { userLocation } = useLocation()

  const { data } = useQuery(
    [QueryKeys.SAME_ARTIST_PLAYLIST, artists],
    () => {
      return fetchOffersByArtist({ artists, searchGroupName, userLocation })
    },
    { enabled: !!netInfo.isConnected, initialData: [] }
  )

  // To check if we can replace this method using Algolia
  const sameArtistPlaylist = useMemo(() => {
    if (!data) return []

    const transformedHitsWithDistance = data.map((hit) => {
      const transformedHit = transformHits(hit)
      const distance = formatDistance({ lat: hit._geoloc.lat, lng: hit._geoloc.lng }, userLocation)

      return { ...transformedHit, distance }
    })

    const sortedHits = transformedHitsWithDistance.sort((a, b) => {
      return parseDistance(a.distance || '0') - parseDistance(b.distance || '0')
    })

    return sortedHits.map(({ distance: _distance, ...rest }) => rest) as HitOfferWithArtistAndEan[]
  }, [data, userLocation, transformHits])

  return { sameArtistPlaylist }
}

const parseDistance = (distance: string) => {
  if (distance.includes('km')) {
    // Convert kilometers to meters
    return parseFloat(distance) * 1000
  }

  return parseFloat(distance)
}
