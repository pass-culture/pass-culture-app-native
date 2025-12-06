import { SearchForFacetValuesResponse, SearchResponse } from 'algoliasearch/lite'

export function searchResponsePredicate<T>(
  response: SearchForFacetValuesResponse | SearchResponse<T>
): response is SearchResponse<T> {
  return 'hits' in response
}
