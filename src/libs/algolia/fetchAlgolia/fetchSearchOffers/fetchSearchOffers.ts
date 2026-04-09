import { FetchSearchResultsArgs } from 'features/search/types'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { getDefaultSearchResponse } from 'libs/algolia/fetchAlgolia/fetchSearchResults/helpers/getDefaultSearchResponse'
import { buildDuplicatedOffersQuery } from 'libs/algolia/fetchAlgolia/fetchSearchResults/queries/buildDuplicatedOffersQuery'
import { buildOffersQuery } from 'libs/algolia/fetchAlgolia/fetchSearchResults/queries/buildOffersQuery'
import { algoliaAnalyticsActions } from 'libs/algolia/store/algoliaAnalyticsStore'
import { Offer } from 'shared/offer/types'

export const fetchSearchOffers = async (args: FetchSearchResultsArgs) => {
  const queries = [buildOffersQuery(args), buildDuplicatedOffersQuery(args)]
  try {
    const { results } = await client.searchForHits<Offer>({ requests: queries })
    const [offersResponse, duplicatedOffersResponse] = results
    algoliaAnalyticsActions.setCurrentQueryID(offersResponse?.queryID)
    return {
      offersResponse: {
        hits: offersResponse?.hits ?? getDefaultSearchResponse<Offer>().hits,
        nbHits: offersResponse?.nbHits ?? getDefaultSearchResponse<Offer>().nbHits,
        nbPages: offersResponse?.nbPages ?? getDefaultSearchResponse<Offer>().nbPages,
        page: offersResponse?.page ?? getDefaultSearchResponse<Offer>().page,
        userData: offersResponse?.userData ?? getDefaultSearchResponse<Offer>().userData,
      },
      duplicatedOffersResponse: {
        hits: duplicatedOffersResponse?.hits ?? getDefaultSearchResponse<Offer>().hits,
        nbHits: duplicatedOffersResponse?.nbHits ?? getDefaultSearchResponse<Offer>().nbHits,
      },
    }
  } catch (error) {
    captureAlgoliaError(error)
    return {
      offersResponse: getDefaultSearchResponse<Offer>(),
      duplicatedOffersResponse: getDefaultSearchResponse<Offer>(),
    }
  }
}
