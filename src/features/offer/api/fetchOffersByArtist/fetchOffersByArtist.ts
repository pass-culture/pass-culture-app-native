import { MultipleQueriesQuery, SearchResponse } from '@algolia/client-search'

import { SubcategoryIdEnum } from 'api/gen'
import { ARTIST_PAGE_SUBCATEGORIES } from 'features/artist/constants'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { multipleQueries } from 'libs/algolia/fetchAlgolia/multipleQueries'
import { AlgoliaOfferWithArtistAndEan } from 'libs/algolia/types'
import { env } from 'libs/environment/env'
import { Position } from 'libs/location'

type BuildAlgoliaFilterType = {
  artistId?: string
}

export type FetchOfferByArtist = BuildAlgoliaFilterType & {
  userLocation: Position
  subcategoryId?: SubcategoryIdEnum
}

export const fetchOffersByArtist = async ({
  artistId,
  subcategoryId,
  userLocation,
}: FetchOfferByArtist) => {
  const defaultQueryParams: MultipleQueriesQuery['params'] = {
    page: 0,
    filters: buildAlgoliaFilter({ artistId }),
    attributesToRetrieve: [...offerAttributesToRetrieve, 'offer.ean', 'artists'],
    attributesToHighlight: [], // We disable highlighting because we don't need it
    aroundRadius: 'all',
    ...(userLocation
      ? { aroundLatLng: `${userLocation.latitude}, ${userLocation.longitude}` }
      : {}),
  }

  const queries: MultipleQueriesQuery[] = [
    // Playlist
    {
      indexName: env.ALGOLIA_OFFERS_INDEX_NAME_B,
      query: '',
      params: {
        ...defaultQueryParams,
        hitsPerPage: 100,
      },
    },
    // Offers top 4
    {
      indexName: env.ALGOLIA_TOP_OFFERS_INDEX_NAME,
      query: '',
      params: {
        ...defaultQueryParams,
        hitsPerPage: 4,
      },
    },
  ]

  if (!artistId || (subcategoryId && !ARTIST_PAGE_SUBCATEGORIES.includes(subcategoryId)))
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

export function buildAlgoliaFilter({ artistId }: BuildAlgoliaFilterType) {
  if (!artistId) return ''

  return `artists.id:"${artistId}"`
}
