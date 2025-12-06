import { SearchResponse } from 'algoliasearch/lite'

export const adaptGenericAlgoliaTypes = <T>(rawAlgoliaResponse: SearchResponse<T>): T[] =>
  rawAlgoliaResponse.hits
