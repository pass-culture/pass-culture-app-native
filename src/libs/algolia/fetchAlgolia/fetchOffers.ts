import { Hit, SearchResponse } from 'algoliasearch/lite'

import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { BuildLocationParameterParams } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { buildOfferSearchParameters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildOfferSearchParameters'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { buildHitsPerPage } from 'libs/algolia/fetchAlgolia/utils'
import { SearchQueryParameters } from 'libs/algolia/types'
import { env } from 'libs/environment/env'
import { Offer } from 'shared/offer/types'

export type FetchOfferArgs = {
  parameters: SearchQueryParameters
  buildLocationParameterParams: BuildLocationParameterParams
  isUserUnderage: boolean
  storeQueryID?: (queryID?: string) => void
  indexSearch?: string
  isFromOffer?: boolean
}

export type FetchOffersResponse = Pick<
  SearchResponse<Offer>,
  'hits' | 'nbHits' | 'page' | 'nbPages' | 'userData'
>

export const fetchOffers = async ({
  parameters,
  buildLocationParameterParams,
  isUserUnderage,
  storeQueryID,
  indexSearch = env.ALGOLIA_OFFERS_INDEX_NAME,
  isFromOffer,
}: FetchOfferArgs): Promise<FetchOffersResponse> => {
  const searchParameters = buildOfferSearchParameters(
    parameters,
    buildLocationParameterParams,
    isUserUnderage
  )

  try {
    const response = await client.searchForHits<Offer>({
      requests: [
        {
          indexName: indexSearch,
          query: parameters.query || '',
          page: parameters.page ?? 0,
          ...buildHitsPerPage(parameters.hitsPerPage),
          ...searchParameters,
          attributesToRetrieve: offerAttributesToRetrieve,
          attributesToHighlight: [], // We disable highlighting because we don't need it
          /* Is needed to get a queryID, in order to send analytics events
             https://www.algolia.com/doc/api-reference/api-parameters/clickAnalytics/ */
          clickAnalytics: true,
          distinct: parameters.distinct,
          // To use exactly the query and not limit the duplicate offers
          ...(isFromOffer ? { typoTolerance: false, distinct: false } : {}),
        },
      ],
    })

    const result = response.results[0]
    if (storeQueryID) storeQueryID(result?.queryID)

    return result ?? { hits: [] as Array<Hit<Offer>>, nbHits: 0, page: 0, nbPages: 0 }
  } catch (error) {
    captureAlgoliaError(error)
    return { hits: [] as Array<Hit<Offer>>, nbHits: 0, page: 0, nbPages: 0 }
  }
}
