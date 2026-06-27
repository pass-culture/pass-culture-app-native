import { initialSearchState } from 'features/search/context/reducer'
import { getStringifySearchStateWithoutLocation } from 'features/search/helpers/getStringifySearchStateWithoutLocation/getStringifySearchStateWithoutLocation'

describe('getStringifySearchStateWithoutLocation', () => {
  it('should return search state without location', () => {
    const stringifySearchStateWithoutLocation =
      getStringifySearchStateWithoutLocation(initialSearchState)

    expect(stringifySearchStateWithoutLocation).toEqual(
      '{"date":null,"gtls":[],"hitsPerPage":20,"isDigital":false,"offerCategories":[],"offerIsDuo":false,"offerSubcategories":[],"query":"","tags":[],"timeRange":null,"offerNativeCategories":[]}'
    )
  })
})
