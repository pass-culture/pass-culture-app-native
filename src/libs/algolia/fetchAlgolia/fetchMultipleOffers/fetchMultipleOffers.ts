import flatten from 'lodash/flatten'

import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { buildOfferSearchParameters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildOfferSearchParameters'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { multipleQueries } from 'libs/algolia/fetchAlgolia/multipleQueries'
import { buildHitsPerPage } from 'libs/algolia/fetchAlgolia/utils'
import { SearchQueryParameters } from 'libs/algolia/types'
import { env } from 'libs/environment'
import { Position } from 'libs/geolocation'
import { Offer } from 'shared/offer/types'

export type FetchMultipleOffersArgs = {
  paramsList: SearchQueryParameters[]
  userLocation: Position
  isUserUnderage: boolean
}

export const fetchMultipleOffers = async ({
  paramsList,
  userLocation,
  isUserUnderage,
}: FetchMultipleOffersArgs): Promise<{ hits: Offer[]; nbHits: number }> => {
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
    const results = await multipleQueries<Offer>(queries)

    return {
      hits: flatten(results.map(({ hits }) => hits)),
      nbHits: results.reduce((prev, curr) => prev + curr.nbHits, 0),
    }
  } catch (error) {
    captureAlgoliaError(error)
    return { hits: [] as Offer[], nbHits: 0 }
  }
}
