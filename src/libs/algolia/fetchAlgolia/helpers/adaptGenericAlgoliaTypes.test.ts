import { SearchResponse } from '@algolia/client-search'

import { adaptGenericAlgoliaTypes } from 'libs/algolia/fetchAlgolia/helpers/adaptGenericAlgoliaTypes'

describe('adaptGenericAlgoliaTypes', () => {
  it('should return algolia hits extracted from a SearchResponse', () => {
    const algoliaFixtureResponse = {
      hits: ['hit1', 'hit2'],
      nbHits: 2,
      nbPages: 1,
    } as SearchResponse<string>
    const result = adaptGenericAlgoliaTypes(algoliaFixtureResponse)
    expect(result).toEqual(['hit1', 'hit2'])
  })
})
