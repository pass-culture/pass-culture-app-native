import { SearchForFacetValuesResponse, SearchForHits, SearchResponse } from 'algoliasearch/lite'
import { chunk } from 'lodash'

import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { client } from 'libs/algolia/fetchAlgolia/clients'

export const multipleQueries = async <Response>(queries: SearchForHits[]) => {
  // Algolia multiple queries has a limit of 50 queries per call
  // so we split the queries in chunks of 50
  // https://www.algolia.com/doc/api-reference/api-methods/multiple-queries/#about-this-method
  const queriesChunks = chunk(queries, 50)

  try {
    const resultsChunks = await Promise.all(
      queriesChunks.map(
        // eslint-disable-next-line local-rules/no-use-of-algolia-multiple-queries
        async (queriesChunk) => client.search<Response>({ requests: queriesChunk })
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
