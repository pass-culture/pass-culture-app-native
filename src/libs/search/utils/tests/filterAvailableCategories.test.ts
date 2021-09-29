import { SearchGroupNameEnum } from 'api/gen'
import { CATEGORY_CRITERIA } from 'features/search/enums'
import { filterAvailableCategories } from 'libs/search/utils'

describe('filterAvailableCategories', () => {
  it('should sort the categories to reuse cached query', () => {
    const categories = [SearchGroupNameEnum.CINEMA, SearchGroupNameEnum.JEU]
    const reversed = [SearchGroupNameEnum.JEU, SearchGroupNameEnum.CINEMA]
    expect(filterAvailableCategories(categories, CATEGORY_CRITERIA)).toEqual(categories)
    expect(filterAvailableCategories(reversed, CATEGORY_CRITERIA)).toEqual(categories)
  })
})
