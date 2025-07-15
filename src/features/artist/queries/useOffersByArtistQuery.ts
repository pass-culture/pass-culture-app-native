import { Hit } from '@algolia/client-search'
import { useQuery } from 'react-query'

import { AlgoliaOfferWithArtistAndEan } from 'libs/algolia/types'
import { Position } from 'libs/location'
import { formatDistance } from 'libs/parsers/formatDistance'
import { QueryKeys } from 'libs/queryKeys'
import { fetchOffersByArtist } from 'queries/offer/fetchOffersByArtist'
import { Prettify } from 'types/Prettify'

type FetchOfferByArtistResult = {
  playlistHits: Hit<AlgoliaOfferWithArtistAndEan>[]
  topOffersHits: Hit<AlgoliaOfferWithArtistAndEan>[]
}

type UseOffersByArtistParams = {
  artistId: string
  userLocation: Position
  enabled?: boolean
}

type UseOffersByArtistSelectParams = Prettify<
  UseOffersByArtistParams & {
    select?: (data: FetchOfferByArtistResult) => AlgoliaOfferWithArtistAndEan[]
  }
>

type UseArtistOffersPlaylistParams = UseOffersByArtistParams & {
  transformHits: (hit: AlgoliaOfferWithArtistAndEan) => AlgoliaOfferWithArtistAndEan
}

type GetSortedHitsInputs = {
  hits: Hit<AlgoliaOfferWithArtistAndEan>[]
  userLocation: Position
  transformHits: (hit: AlgoliaOfferWithArtistAndEan) => AlgoliaOfferWithArtistAndEan
}

const useOffersByArtistQuery = ({
  artistId,
  userLocation,
  select,
  enabled = true,
}: UseOffersByArtistSelectParams) =>
  useQuery({
    queryKey: [QueryKeys.ARTIST_PLAYLIST, artistId],
    queryFn: () => fetchOffersByArtist({ artistId, userLocation }),
    enabled: enabled && !!artistId,
    select,
  })

export const useArtistOffersPlaylistQuery = ({
  artistId,
  userLocation,
  enabled,
  transformHits,
}: UseArtistOffersPlaylistParams) =>
  useOffersByArtistQuery({
    artistId,
    userLocation,
    enabled,
    select: (data) =>
      getSortedHits({
        transformHits,
        userLocation,
        hits: data.playlistHits,
      }),
  })

export const useArtistTopOffersPlaylistQuery = ({
  artistId,
  userLocation,
  enabled,
  transformHits,
}: UseArtistOffersPlaylistParams) =>
  useOffersByArtistQuery({
    artistId,
    userLocation,
    enabled,
    select: (data) =>
      getSortedHits({
        transformHits,
        userLocation,
        hits: data.topOffersHits,
      }),
  })

const getSortedHits = ({
  hits,
  userLocation,
  transformHits,
}: GetSortedHitsInputs): AlgoliaOfferWithArtistAndEan[] => {
  if (hits.length === 0) return []

  const transformedHitsWithDistance = hits.map((hit) => {
    const transformedHit = transformHits(hit)
    const distance = formatDistance({ lat: hit._geoloc.lat, lng: hit._geoloc.lng }, userLocation)

    return { ...transformedHit, distance: parseDistance(distance || '0') }
  })

  const sortedHits = [...transformedHitsWithDistance].sort((a, b) => a.distance - b.distance)

  return sortedHits.map(({ distance: _distance, ...rest }) => rest)
}

const parseDistance = (distanceString: string) => {
  const distance = parseFloat(distanceString)
  const unitInMeters = distanceString.includes('km') ? 1000 : 1
  return distance * unitInMeters
}
