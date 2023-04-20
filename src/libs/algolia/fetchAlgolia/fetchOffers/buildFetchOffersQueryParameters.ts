import { buildOfferSearchParameters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildOfferSearchParameters.ts'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { buildHitsPerPage } from 'libs/algolia/fetchAlgolia/utils'
import { AlgoliaQueryParameters, FetchOfferParameters } from 'libs/algolia/types'

export const buildFetchOffersQueryParameters = ({
  isUserUnderage,
  parameters,
  userLocation,
}: FetchOfferParameters): AlgoliaQueryParameters => {
  const searchParameters = buildOfferSearchParameters(parameters, userLocation, isUserUnderage)

  return {
    query: parameters.query,
    requestOptions: {
      page: parameters.page || 0,
      ...buildHitsPerPage(parameters.hitsPerPage),
      ...searchParameters,
      attributesToRetrieve: offerAttributesToRetrieve,
      attributesToHighlight: [], // We disable highlighting because we don't need it
      /* Is needed to get a queryID, in order to send analytics events
         https://www.algolia.com/doc/api-reference/api-parameters/clickAnalytics/ */
      clickAnalytics: true,
    },
  }
}
