import flatten from 'lodash/flatten'

import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { buildOfferSearchParameters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildOfferSearchParameters'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { multipleQueries } from 'libs/algolia/fetchAlgolia/multipleQueries'
import { searchResponsePredicate } from 'libs/algolia/fetchAlgolia/searchResponsePredicate'
import { buildHitsPerPage } from 'libs/algolia/fetchAlgolia/utils'
import { SearchQueryParameters } from 'libs/algolia/types'
import { env } from 'libs/environment'
import { Offer } from 'shared/offer/types'

type FetchMultipleOffersArgs = {
  paramsList: SearchQueryParameters[]
  isUserUnderage: boolean
}

export const fetchMultipleOffers = async ({
  paramsList,
  isUserUnderage,
}: FetchMultipleOffersArgs): Promise<{ hits: Offer[]; nbHits: number }> => {
  const queries = paramsList.map((params) => ({
    indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
    query: params.query,
    params: {
      ...buildHitsPerPage(params.hitsPerPage),
      ...buildOfferSearchParameters(params, isUserUnderage),
      attributesToHighlight: [], // We disable highlighting because we don't need it
      attributesToRetrieve: offerAttributesToRetrieve,
    },
  }))

  try {
    const results = await multipleQueries<Offer>(queries)
    const searchResponseResults = results.filter(searchResponsePredicate)

    return {
      hits: flatten(searchResponseResults.map(({ hits }) => hits)),
      nbHits: searchResponseResults.reduce((prev, curr) => prev + curr.nbHits, 0),
    }
  } catch (error) {
    captureAlgoliaError(error)
    return { hits: [] as Offer[], nbHits: 0 }
  }
}
