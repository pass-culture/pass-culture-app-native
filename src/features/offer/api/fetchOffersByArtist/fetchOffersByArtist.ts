import { MultipleQueriesQuery, SearchResponse } from '@algolia/client-search'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { EXCLUDED_ARTISTS } from 'features/offer/helpers/constants'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { multipleQueries } from 'libs/algolia/fetchAlgolia/multipleQueries'
import { env } from 'libs/environment'
import { Position } from 'libs/location'
import { HitOffer, Offer } from 'shared/offer/types'

type BuildAlgoliaFilterType = {
  artists?: string | null
}

export type FetchOfferByArtist = BuildAlgoliaFilterType & {
  searchGroupName: SearchGroupNameEnumv2
  userLocation: Position
}

export type HitOfferWithArtistAndEan = Offer & {
  offer: HitOffer & {
    artist: string
    ean: string
  }
}

export const fetchOffersByArtist = async ({
  artists,
  searchGroupName,
  userLocation,
}: FetchOfferByArtist) => {
  const queries: MultipleQueriesQuery[] = [
    // Playlist
    {
      indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
      query: '',
      params: {
        page: 0,
        filters: buildAlgoliaFilter({ artists }),
        hitsPerPage: 100,
        attributesToRetrieve: [...offerAttributesToRetrieve, 'offer.artist', 'offer.ean'],
        attributesToHighlight: [], // We disable highlighting because we don't need it
        aroundRadius: 'all',
        ...(userLocation
          ? { aroundLatLng: `${userLocation.latitude}, ${userLocation.longitude}` }
          : {}),
      },
    },
    // Offers top 4
    {
      indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
      query: '',
      params: {
        page: 0,
        filters: buildAlgoliaFilter({ artists }),
        hitsPerPage: 4,
        attributesToRetrieve: [...offerAttributesToRetrieve, 'offer.artist', 'offer.ean'],
        attributesToHighlight: [], // We disable highlighting because we don't need it
        aroundRadius: 'all',
        ...(userLocation
          ? { aroundLatLng: `${userLocation.latitude}, ${userLocation.longitude}` }
          : {}),
      },
    },
  ]

  if (
    !artists ||
    EXCLUDED_ARTISTS.includes(artists.toLowerCase()) ||
    (searchGroupName !== SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE &&
      searchGroupName !== SearchGroupNameEnumv2.LIVRES)
  )
    return { playlistHits: [], topOffersHits: [] }

  try {
    const [playlistResponse, topOffersResponse] = (await multipleQueries<HitOfferWithArtistAndEan>(
      queries
    )) as [SearchResponse<HitOfferWithArtistAndEan>, SearchResponse<HitOfferWithArtistAndEan>]

    return { playlistHits: playlistResponse.hits, topOffersHits: topOffersResponse.hits }
  } catch (error) {
    captureAlgoliaError(error)
    return { playlistHits: [], topOffersHits: [] }
  }
}

export function buildAlgoliaFilter({ artists }: BuildAlgoliaFilterType) {
  const firstArtist = artists?.split(' ; ')[0]

  if (!firstArtist) return ''

  return `offer.artist:"${firstArtist}"`
}
