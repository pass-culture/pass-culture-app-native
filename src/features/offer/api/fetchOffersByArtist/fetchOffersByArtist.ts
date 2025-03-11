import { MultipleQueriesQuery, SearchResponse } from '@algolia/client-search'

import { SubcategoryIdEnum } from 'api/gen'
import { ARTIST_PAGE_SUBCATEGORIES } from 'features/artist/constants'
import { EXCLUDED_ARTISTS } from 'features/offer/helpers/constants'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { multipleQueries } from 'libs/algolia/fetchAlgolia/multipleQueries'
import { AlgoliaOfferWithArtistAndEan } from 'libs/algolia/types'
import { env } from 'libs/environment/env'
import { Position } from 'libs/location'

type BuildAlgoliaFilterType = {
  artists?: string | null
}

export type FetchOfferByArtist = BuildAlgoliaFilterType & {
  subcategoryId: SubcategoryIdEnum
  userLocation: Position
}

export const fetchOffersByArtist = async ({
  artists,
  subcategoryId,
  userLocation,
}: FetchOfferByArtist) => {
  const queries: MultipleQueriesQuery[] = [
    // Playlist
    {
      indexName: env.ALGOLIA_OFFERS_INDEX_NAME_B,
      query: '',
      params: {
        page: 0,
        filters: buildAlgoliaFilter({ artists }),
        hitsPerPage: 100,
        attributesToRetrieve: [...offerAttributesToRetrieve, 'offer.ean'],
        attributesToHighlight: [], // We disable highlighting because we don't need it
        aroundRadius: 'all',
        ...(userLocation
          ? { aroundLatLng: `${userLocation.latitude}, ${userLocation.longitude}` }
          : {}),
      },
    },
    // Offers top 4
    {
      indexName: env.ALGOLIA_TOP_OFFERS_INDEX_NAME,
      query: '',
      params: {
        page: 0,
        filters: buildAlgoliaFilter({ artists }),
        hitsPerPage: 4,
        attributesToRetrieve: [...offerAttributesToRetrieve, 'offer.ean'],
        attributesToHighlight: [], // We disable highlighting because we don't need it
        aroundRadius: 'all',
        ...(userLocation
          ? { aroundLatLng: `${userLocation.latitude}, ${userLocation.longitude}` }
          : {}),
      },
    },
  ]

  // TODO(PC-33464): point of vigilance when we will use a hook which get the artists from Algolia
  if (
    !artists ||
    EXCLUDED_ARTISTS.includes(artists.toLowerCase()) ||
    !ARTIST_PAGE_SUBCATEGORIES.includes(subcategoryId)
  )
    return { playlistHits: [], topOffersHits: [] }

  try {
    const [playlistResponse, topOffersResponse] =
      (await multipleQueries<AlgoliaOfferWithArtistAndEan>(queries)) as [
        SearchResponse<AlgoliaOfferWithArtistAndEan>,
        SearchResponse<AlgoliaOfferWithArtistAndEan>,
      ]

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
