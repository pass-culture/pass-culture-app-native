import { Hit } from '@algolia/client-search'
import { useCallback, useMemo } from 'react'
import { useQuery } from 'react-query'

import { SubcategoryIdEnum } from 'api/gen'
import { fetchOffersByArtist } from 'features/offer/api/fetchOffersByArtist/fetchOffersByArtist'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { AlgoliaOfferWithArtistAndEan } from 'libs/algolia/types'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { useLocation } from 'libs/location'
import { formatDistance } from 'libs/parsers/formatDistance'
import { QueryKeys } from 'libs/queryKeys'

type UseArtistResultsProps = {
  subcategoryId?: SubcategoryIdEnum
  artistId?: string
}

export const useArtistResultsQuery = ({ artistId, subcategoryId }: UseArtistResultsProps) => {
  const transformHits = useTransformOfferHits()
  const { userLocation } = useLocation()
  const { artistPageSubcategories } = useRemoteConfigQuery()

  const { data } = useQuery(
    [QueryKeys.ARTIST_PLAYLIST, artistId],
    async () => {
      const { playlistHits, topOffersHits } = await fetchOffersByArtist({
        artistId,
        userLocation,
      })
      return { playlistHits, topOffersHits }
    },
    {
      initialData: { playlistHits: [], topOffersHits: [] },
      enabled: !!(
        artistId &&
        (!subcategoryId || artistPageSubcategories.subcategories.includes(subcategoryId))
      ),
    }
  )

  const getSortedHits = useCallback(
    (hits: Hit<AlgoliaOfferWithArtistAndEan>[]) => {
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
      ) as AlgoliaOfferWithArtistAndEan[]
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
