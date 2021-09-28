import { CategoryIdEnum } from 'api/gen'
import { CATEGORY_CRITERIA } from 'features/search/enums'
import { filterAvailableCategories } from 'libs/search/utils'

describe('filterAvailableCategories', () => {
  it('should sort the categories to reuse cached query', () => {
    const categories = [CategoryIdEnum.CINEMA, CategoryIdEnum.JEU]
    const reversed = [CategoryIdEnum.JEU, CategoryIdEnum.CINEMA]
    expect(filterAvailableCategories(categories, CATEGORY_CRITERIA)).toEqual(categories)
    expect(filterAvailableCategories(reversed, CATEGORY_CRITERIA)).toEqual(categories)
  })
})
