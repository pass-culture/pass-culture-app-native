import { formattedCategoryListModule } from 'features/home/fixtures/homepage.fixture'
import { adaptCategoryListModule } from 'libs/contentful/adapters/modules/adaptCategoryListModule'
import { categoryListFixture } from 'libs/contentful/fixtures/categoryList.fixture'

describe('adaptCategoryListModule', () => {
  it('should adapt a CategoryList module', () => {
    const rawCategoryListModule = categoryListFixture

    expect(adaptCategoryListModule(rawCategoryListModule)).toEqual(formattedCategoryListModule)
  })
})
