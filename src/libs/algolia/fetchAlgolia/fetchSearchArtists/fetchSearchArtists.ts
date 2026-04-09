import { FetchSearchResultsArgs } from 'features/search/types'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { getDefaultSearchResponse } from 'libs/algolia/fetchAlgolia/fetchSearchResults/helpers/getDefaultSearchResponse'
import { buildArtistsQuery } from 'libs/algolia/fetchAlgolia/fetchSearchResults/queries/buildArtistsQuery'
import { Offer } from 'shared/offer/types'

export const fetchSearchArtists = async (args: FetchSearchResultsArgs) => {
  const queries = [buildArtistsQuery(args)]

  try {
    const { results } = await client.searchForHits<Offer>({ requests: queries })
    const [offerArtistsResponse] = results

    return {
      offerArtistsResponse: offerArtistsResponse ?? getDefaultSearchResponse<Offer>(),
    }
  } catch (error) {
    captureAlgoliaError(error)

    return {
      offerArtistsResponse: getDefaultSearchResponse<Offer>(),
    }
  }
}
