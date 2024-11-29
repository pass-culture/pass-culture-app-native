import { flatten } from 'lodash'

import { OffersPlaylistParameters } from 'features/home/types'
import { buildOfferSearchParameters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildOfferSearchParameters'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { buildHitsPerPage } from 'libs/algolia/fetchAlgolia/utils'
import { OfferModuleQuery } from 'libs/algolia/types'
import { env } from 'libs/environment'

type buildOffersModuleQueriesArgs = {
  paramsList: OffersPlaylistParameters[]
  isUserUnderage: boolean
}

export const buildOffersModulesQueries = ({
  paramsList,
  isUserUnderage,
}: buildOffersModuleQueriesArgs): OfferModuleQuery[] => {
  // We flatten the paramList as an offer module have a list of additionalParameters
  const queries = flatten(paramsList).map((params) => {
    const query: OfferModuleQuery = {
      indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
      query: params.offerParams.query,
      params: {
        ...buildHitsPerPage(params.offerParams.hitsPerPage),
        ...buildOfferSearchParameters(params.offerParams, params.locationParams, isUserUnderage),
        attributesToHighlight: [], // We disable highlighting because we don't need it
        attributesToRetrieve: offerAttributesToRetrieve,
      },
    }
    return query
  })

  return queries
}
