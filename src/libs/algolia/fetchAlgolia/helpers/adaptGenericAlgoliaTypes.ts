import { SearchResponse } from '@algolia/client-search'

export const adaptGenericAlgoliaTypes = <T>(rawAlgoliaResponse: SearchResponse<T>): T[] =>
  rawAlgoliaResponse.hits
