import { Hit, SearchResponse } from '@algolia/client-search'

type MockAlgoliaResponse = <Response = Record<string, unknown>>(
  hits: Array<Hit<Response>>
) => SearchResponse<Response>

export const mockAlgoliaResponse: MockAlgoliaResponse = (hits) => ({
  hits,
  nbHits: hits.length,
  page: 1,
  nbPages: 1,
  hitsPerPage: hits.length,
  processingTimeMS: 123,
  exhaustiveNbHits: true,
  query: '',
  params: '',
})
