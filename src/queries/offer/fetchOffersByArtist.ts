import { SearchForHits, SearchParamsObject, SearchResponse } from 'algoliasearch/lite'

import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { multipleQueries } from 'libs/algolia/fetchAlgolia/multipleQueries'
import { AlgoliaOfferWithArtistAndEan } from 'libs/algolia/types'
import { env } from 'libs/environment/env'
import { Position } from 'libs/location/location'

type BuildAlgoliaFilterType = {
  artistId?: string
}

export type FetchOfferByArtist = BuildAlgoliaFilterType & {
  userLocation: Position
}

export const fetchOffersByArtist = async ({ artistId, userLocation }: FetchOfferByArtist) => {
  const defaultQueryParams: SearchParamsObject = {
    query: '',
    page: 0,
    filters: buildAlgoliaFilter({ artistId }),
    attributesToRetrieve: [...offerAttributesToRetrieve, 'offer.ean', 'artists'],
    attributesToHighlight: [], // We disable highlighting because we don't need it
    aroundRadius: 'all',
    ...(userLocation
      ? { aroundLatLng: `${userLocation.latitude}, ${userLocation.longitude}` }
      : {}),
  }

  const queries: SearchForHits[] = [
    // Playlist
    {
      indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
      ...defaultQueryParams,
      hitsPerPage: 100,
    },
    // Offers top 4
    {
      indexName: env.ALGOLIA_TOP_OFFERS_INDEX_NAME,
      ...defaultQueryParams,
      hitsPerPage: 4,
    },
  ]

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

  return `artists.id:${artistId}`
}
