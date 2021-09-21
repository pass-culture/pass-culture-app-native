import { CategoryNameEnum } from 'api/gen'
import { CATEGORY_CRITERIA } from 'features/search/enums'
import { filterAvailableCategories } from 'libs/search/utils/filterAvailableCategories'

describe('filterAvailableCategories', () => {
  it('should sort the categories to reuse cached query', () => {
    const categories = [CategoryNameEnum.CINEMA, CategoryNameEnum.JEUXVIDEO]
    const reversed = [CategoryNameEnum.JEUXVIDEO, CategoryNameEnum.CINEMA]
    expect(filterAvailableCategories(categories, CATEGORY_CRITERIA)).toEqual(categories)
    expect(filterAvailableCategories(reversed, CATEGORY_CRITERIA)).toEqual(categories)
  })
})
