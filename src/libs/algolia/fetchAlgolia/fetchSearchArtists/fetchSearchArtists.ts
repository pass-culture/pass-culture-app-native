import { FetchSearchResultsArgs } from 'features/search/types'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { getDefaultSearchResponse } from 'libs/algolia/fetchAlgolia/fetchSearchResults/helpers/getDefaultSearchResponse'
import { buildArtistsQuery } from 'libs/algolia/fetchAlgolia/fetchSearchResults/queries/buildArtistsQuery'
import { AlgoliaArtist } from 'libs/algolia/types'

export const fetchSearchArtists = async (args: FetchSearchResultsArgs) => {
  const query = buildArtistsQuery(args)
  try {
    const { results } = await client.searchForHits<AlgoliaArtist>({ requests: [query] })
    const [artistsResponse] = results

    return {
      artistsResponse: artistsResponse ?? getDefaultSearchResponse<AlgoliaArtist>(),
    }
  } catch (error) {
    captureAlgoliaError(error)

    return {
      artistsResponse: getDefaultSearchResponse<AlgoliaArtist>(),
    }
  }
}
