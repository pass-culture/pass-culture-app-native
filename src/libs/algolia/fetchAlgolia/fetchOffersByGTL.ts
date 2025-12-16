import { initialSearchState } from 'features/search/context/reducer'
import { buildOfferSearchParameters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildOfferSearchParameters'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { multipleQueries } from 'libs/algolia/fetchAlgolia/multipleQueries'
import { searchResponsePredicate } from 'libs/algolia/fetchAlgolia/searchResponsePredicate'
import { buildHitsPerPage } from 'libs/algolia/fetchAlgolia/utils'
import { fetchOffersByGTLArgs } from 'libs/algolia/types'
import { env } from 'libs/environment/env'
import { Offer } from 'shared/offer/types'

export const fetchOffersByGTL = async ({
  parameters,
  buildLocationParameterParams,
  isUserUnderage,
  searchIndex,
}: fetchOffersByGTLArgs) => {
  // Build a query list to send to Algolia
  const queries = parameters.map(({ offerParams }) => ({
    indexName: searchIndex || env.ALGOLIA_TOP_OFFERS_INDEX_NAME,
    query: '',
    ...buildHitsPerPage(offerParams.hitsPerPage),
    ...buildOfferSearchParameters(
      {
        ...initialSearchState,
        ...offerParams,
      },
      buildLocationParameterParams,
      isUserUnderage
    ),
    attributesToHighlight: [], // We disable highlighting because we don't need it
    attributesToRetrieve: offerAttributesToRetrieve,
  }))

  // Fetch all offers
  const allQueries = await multipleQueries<Offer>(queries)

  // Assign offers to playlist list
  return allQueries.filter(searchResponsePredicate)
}
