import { MultipleQueriesQuery, SearchResponse } from '@algolia/client-search'
import algoliasearch from 'algoliasearch'
import { chunk } from 'lodash'
import { Offer } from 'shared/offer/types'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { SearchForFacetValuesResponse } from 'instantsearch.js'
import { env } from 'libs/environment'

const client = algoliasearch(env.ALGOLIA_APPLICATION_ID, 'd18a70ec632143ea619e98979fe9d06e')

const multipleQueries2 = async <Response>(queries: MultipleQueriesQuery[]) => {
  // Algolia multiple queries has a limit of 50 queries per call
  // so we split the queries in chunks of 50
  // https://www.algolia.com/doc/api-reference/api-methods/multiple-queries/#about-this-method
  const queriesChunks = chunk(queries, 50)

  try {
    const resultsChunks = await Promise.all(
      queriesChunks.map(
        // eslint-disable-next-line local-rules/no-use-of-algolia-multiple-queries
        async (queriesChunk) => client.multipleQueries<Response>(queriesChunk)
      )
    )
    return resultsChunks.reduce<(SearchForFacetValuesResponse | SearchResponse<Response>)[]>(
      (prev, curr) => prev.concat(curr.results),
      []
    )
  } catch (error) {
    captureAlgoliaError(error)
    return []
  }
}

export const fetchEuroOffers = async () => {
  const queries = [
    // Offers
    {
      indexName: 'TESTING-european_offers',
      query: '',
      params: {},
    },
  ]

  const [offersResponse] = await multipleQueries2(queries)
  return offersResponse.hits
}

export const fetchEuroOffers2 = async () => {
  const index = client.initIndex('TESTING-european_offers')
  const response = await index.search('', { query: '' })
  return response
}
