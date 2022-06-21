import flatten from 'lodash.flatten'

import { PartialSearchState } from 'features/search/types'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import {
  offerAttributesToRetrieve,
  buildOfferSearchParameters,
} from 'libs/algolia/fetchAlgolia/config'
import { buildHitsPerPage } from 'libs/algolia/fetchAlgolia/utils'
import { env } from 'libs/environment'
import { GeoCoordinates } from 'libs/geolocation'
import { SearchHit } from 'libs/search'

export const fetchMultipleOffers = async (
  paramsList: PartialSearchState[],
  userLocation: GeoCoordinates | null,
  isUserUnderage: boolean
): Promise<{ hits: SearchHit[]; nbHits: number }> => {
  const queries = paramsList.map((params) => ({
    indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
    query: params.query,
    params: {
      ...buildHitsPerPage(params.hitsPerPage),
      ...buildOfferSearchParameters(params, userLocation, isUserUnderage),
      attributesToHighlight: [], // We disable highlighting because we don't need it
      attributesToRetrieve: offerAttributesToRetrieve,
    },
  }))

  try {
    const response = await client.multipleQueries<SearchHit>(queries)
    const { results } = response

    return {
      hits: flatten(results.map(({ hits }) => hits)),
      nbHits: results.reduce((prev, curr) => prev + curr.nbHits, 0),
    }
  } catch (error) {
    captureAlgoliaError(error)
    return { hits: [] as SearchHit[], nbHits: 0 }
  }
}
