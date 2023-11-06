import { SearchForFacetValuesResponse, SearchResponse } from '@algolia/client-search'

export function searchResponsePredicate<T>(
  response: SearchForFacetValuesResponse | SearchResponse<T>
): response is SearchResponse<T> {
  return 'hits' in response
}
