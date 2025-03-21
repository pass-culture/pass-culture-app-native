import { SearchGroupNameEnumv2 } from 'api/gen'
import { getCategoriesFacetFilters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/getCategoriesFacetFilters'

describe('getCategoriesFacetFilters', () => {
  it('should return the search group when category label is in Contentful labels', () => {
    const value = getCategoriesFacetFilters('Concerts & festivals')

    expect(value).toEqual(SearchGroupNameEnumv2.CONCERTS_FESTIVALS)
  })
})
