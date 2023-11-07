import { SearchForFacetValuesResponse, SearchResponse } from '@algolia/client-search'

import { searchResponsePredicate } from 'libs/algolia/fetchAlgolia/searchResponsePredicate'

describe('searchResponsePredicate', () => {
  it('should return only search responses', () => {
    const searchResponse: SearchResponse<unknown> = {
      hits: [],
      page: 0,
      nbHits: 0,
      nbPages: 0,
      hitsPerPage: 20,
      processingTimeMS: 0,
      exhaustiveNbHits: false,
      query: '',
      params: '',
    }
    const searchForFacetValuesResponse: SearchForFacetValuesResponse = {
      facetHits: [],
      exhaustiveFacetsCount: false,
      processingTimeMS: 0,
    }
    const responses: (SearchForFacetValuesResponse | SearchResponse<unknown>)[] = [
      searchResponse,
      searchForFacetValuesResponse,
    ]
    const searchResponses = responses.filter(searchResponsePredicate)

    expect(searchResponses).toEqual([searchResponse])
  })
})
