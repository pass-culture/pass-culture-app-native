import { initialSearchState } from 'features/search/context/reducer'
import { getStringifySearchStateWithoutLocation } from 'features/search/helpers/getStringifySearchStateWithoutLocation/getStringifySearchStateWithoutLocation'

describe('getStringifySearchStateWithoutLocation', () => {
  it('should return search state without location', () => {
    const stringifySearchStateWithoutLocation =
      getStringifySearchStateWithoutLocation(initialSearchState)

    expect(stringifySearchStateWithoutLocation).toEqual(
      '{"date":null,"defaultMaxPrice":"","defaultMinPrice":"","gtls":[],"hitsPerPage":20,"isDigital":false,"offerCategories":[],"offerIsDuo":false,"offerIsFree":false,"offerSubcategories":[],"priceRange":null,"query":"","tags":[],"timeRange":null,"offerNativeCategories":[]}'
    )
  })
})
