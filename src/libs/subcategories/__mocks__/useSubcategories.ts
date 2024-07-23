import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { useSubcategories as actualUseSubcategories } from 'libs/subcategories/useSubcategories'

export const useSubcategories: jest.Mock<typeof actualUseSubcategories> = jest
  .fn()
  .mockReturnValue({
    data: subcategoriesDataTest,
    isLoading: false,
  })
