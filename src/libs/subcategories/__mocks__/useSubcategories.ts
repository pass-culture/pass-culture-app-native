import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'

export const useSubcategories = jest
  .fn()
  .mockReturnValue({
    data: subcategoriesDataTest,
    isLoading: false,
  })
