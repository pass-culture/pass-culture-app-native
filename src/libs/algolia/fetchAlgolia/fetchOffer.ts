import { Hit } from '@algolia/client-search'

import { Response } from 'features/search/api/useSearchResults/useSearchResults'
import { SearchHit } from 'libs/algolia'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { buildOfferSearchParameters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildOfferSearchParameters.ts'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { buildHitsPerPage } from 'libs/algolia/fetchAlgolia/utils'
import { SearchParametersQuery } from 'libs/algolia/types'
import { env } from 'libs/environment'
import { GeoCoordinates } from 'libs/geolocation'

type FetchOfferArgs = {
  parameters: SearchParametersQuery
  userLocation: GeoCoordinates | null
  isUserUnderage: boolean
  storeQueryID?: (queryID?: string) => void
  excludedObjectIds?: string[]
  indexSearch?: string
}

export const fetchOffer = async ({
  parameters,
  userLocation,
  isUserUnderage,
  storeQueryID,
  indexSearch = env.ALGOLIA_OFFERS_INDEX_NAME,
}: FetchOfferArgs): Promise<Response> => {
  const searchParameters = buildOfferSearchParameters(parameters, userLocation, isUserUnderage)
  const index = client.initIndex(indexSearch)

  try {
    const response = await index.search<SearchHit>(parameters.query || '', {
      page: parameters.page || 0,
      ...buildHitsPerPage(parameters.hitsPerPage),
      ...searchParameters,
      attributesToRetrieve: offerAttributesToRetrieve,
      attributesToHighlight: [], // We disable highlighting because we don't need it
      /* Is needed to get a queryID, in order to send analytics events
         https://www.algolia.com/doc/api-reference/api-parameters/clickAnalytics/ */
      clickAnalytics: true,
    })

    if (storeQueryID) storeQueryID(response.queryID)

    return response
  } catch (error) {
    captureAlgoliaError(error)
    return { hits: [] as Hit<SearchHit>[], nbHits: 0, page: 0, nbPages: 0 }
  }
}
