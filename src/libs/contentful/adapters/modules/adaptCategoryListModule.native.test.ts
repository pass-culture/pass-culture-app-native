import { formattedCategoryListModule } from 'features/home/fixtures/homepage.fixture'
import { adaptCategoryListModule } from 'libs/contentful/adapters/modules/adaptCategoryListModule'
import { categoryListFixture } from 'libs/contentful/fixtures/categoryList.fixture'
import { isCategoryListContentModel } from 'libs/contentful/types'

describe('adaptCategoryListModule', () => {
  it('should adapt a CategoryList module', () => {
    const rawCategoryListModule = categoryListFixture

    expect(isCategoryListContentModel(rawCategoryListModule)).toBeTruthy()
    expect(adaptCategoryListModule(rawCategoryListModule)).toEqual(formattedCategoryListModule)
  })
})
