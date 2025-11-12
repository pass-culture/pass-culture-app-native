import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'

export const useSubcategoriesQuery = jest.fn().mockReturnValue({
  data: subcategoriesDataTest,
  isLoading: false,
})
