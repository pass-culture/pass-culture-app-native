import { useMemo } from 'react'
import { useQuery } from 'react-query'

import {
  FetchOfferByArtist,
  HitOfferWithArtistAndEan,
  fetchOffersByArtist,
} from 'features/offer/api/fetchOffersByArtist/fetchOffersByArtist'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { useLocation } from 'libs/location'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { formatDistance } from 'libs/parsers/formatDistance'
import { QueryKeys } from 'libs/queryKeys'

export const useSameArtistPlaylist = ({ artists, searchGroupName }: FetchOfferByArtist) => {
  const netInfo = useNetInfoContext()
  const transformHits = useTransformOfferHits()
  const { userLocation } = useLocation()

  const { data } = useQuery(
    [QueryKeys.SAME_ARTIST_PLAYLIST, artists],
    () => {
      return fetchOffersByArtist({ artists, searchGroupName })
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

    const sortedHits = transformedHitsWithDistance.sort(
      (a, b) => parseFloat(a.distance || '0') - parseFloat(b.distance || '0')
    )

    return sortedHits.map(({ distance: _distance, ...rest }) => rest) as HitOfferWithArtistAndEan[]
  }, [data, userLocation, transformHits])

  return { sameArtistPlaylist }
}
