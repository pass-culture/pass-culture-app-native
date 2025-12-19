import { LiteClient } from 'algoliasearch/lite'

import { client } from 'libs/algolia/fetchAlgolia/clients'

type SearchRequest = { query?: string; params?: { query?: string } | string }

const hasNoQuery = (request: SearchRequest): boolean => {
  const hasQuery = request.query || (typeof request.params === 'object' && request.params?.query)
  return !hasQuery
}

export const getSearchClient: LiteClient = {
  ...client,
  search(searchMethodParams, requestOptions) {
    const requests = (
      Array.isArray(searchMethodParams) ? searchMethodParams : searchMethodParams.requests
    ) as SearchRequest[]

    if (requests.every(hasNoQuery)) {
      return Promise.resolve({
        results: requests.map(() => ({
          hits: [],
          nbHits: 0,
          page: 0,
          nbPages: 0,
          hitsPerPage: 0,
          processingTimeMS: 0,
          exhaustiveNbHits: false,
          query: '',
          params: '',
        })),
      })
    }
    return client.search(searchMethodParams, requestOptions)
  },
}
