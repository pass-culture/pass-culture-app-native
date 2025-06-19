import { Hit } from '@algolia/client-search'
import { useQuery } from 'react-query'

import { SubcategoryIdEnum } from 'api/gen'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { AlgoliaOfferWithArtistAndEan } from 'libs/algolia/types'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { Position, useLocation } from 'libs/location'
import { formatDistance } from 'libs/parsers/formatDistance'
import { QueryKeys } from 'libs/queryKeys'

import { fetchOffersByArtist } from './fetchOffersByArtist'

type UseArtistResultsProps = {
  subcategoryId?: SubcategoryIdEnum
  artistId?: string
}

export const useArtistResultsQuery = ({ artistId, subcategoryId }: UseArtistResultsProps) => {
  const transformHits = useTransformOfferHits()
  const { userLocation } = useLocation()
  const { artistPageSubcategories } = useRemoteConfigQuery()

  return useQuery({
    queryKey: [QueryKeys.ARTIST_PLAYLIST, artistId],
    queryFn: async () => {
      const { playlistHits, topOffersHits } = await fetchOffersByArtist({
        artistId,
        userLocation,
      })
      return { playlistHits, topOffersHits }
    },
    initialData: { playlistHits: [], topOffersHits: [] },
    enabled: !!(
      artistId &&
      (!subcategoryId || artistPageSubcategories.subcategories.includes(subcategoryId))
    ),
    select(data) {
      const artistPlaylist = getSortedHits({
        transformHits,
        userLocation,
        hits: data.playlistHits,
      })

      const artistTopOffers = getSortedHits({
        transformHits,
        userLocation,
        hits: data.topOffersHits,
      })

      return { artistPlaylist, artistTopOffers }
    },
  })
}

const getSortedHits = ({
  transformHits,
  userLocation,
  hits,
}: {
  transformHits: (hit: AlgoliaOfferWithArtistAndEan) => AlgoliaOfferWithArtistAndEan
  userLocation: Position
  hits: Hit<AlgoliaOfferWithArtistAndEan>[]
}): AlgoliaOfferWithArtistAndEan[] => {
  if (hits.length === 0) return []

  const transformedHitsWithDistance = hits.map((hit) => {
    const transformedHit = transformHits(hit)
    const distance = formatDistance({ lat: hit._geoloc.lat, lng: hit._geoloc.lng }, userLocation)

    return { ...transformedHit, distance: parseDistance(distance || '0') }
  })

  const sortedHits = [...transformedHitsWithDistance].sort((a, b) => a.distance - b.distance)

  return sortedHits.map(({ distance: _distance, ...rest }): AlgoliaOfferWithArtistAndEan => rest)
}

const parseDistance = (distance: string) => {
  if (distance.includes('km')) {
    // Convert kilometers to meters
    return parseFloat(distance) * 1000
  }

  return parseFloat(distance)
}
