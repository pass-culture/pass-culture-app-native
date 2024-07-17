import { initialSearchState } from 'features/search/context/reducer'
import { getStringifySearchStateWithoutLocation } from 'features/search/helpers/getStringifySearchStateWithoutLocation/getStringifySearchStateWithoutLocation'

describe('getStringifySearchStateWithoutLocation', () => {
  it('should return search state without location', () => {
    const stringifySearchStateWithoutLocation =
      getStringifySearchStateWithoutLocation(initialSearchState)

    expect(stringifySearchStateWithoutLocation).toEqual(
      '{"date":null,"hitsPerPage":20,"offerCategories":[],"offerSubcategories":[],"offerIsDuo":false,"offerIsFree":false,"isDigital":false,"priceRange":null,"query":"","tags":[],"timeRange":null,"gtls":[]}'
    )
  })
})
