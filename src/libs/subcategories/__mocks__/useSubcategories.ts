import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { useSubcategories as ActualUseSubcategories } from 'libs/subcategories/useSubcategories'

export const useSubcategories: jest.Mock<typeof ActualUseSubcategories> = jest
  .fn()
  .mockReturnValue({
    data: subcategoriesDataTest,
    isLoading: false,
  })
