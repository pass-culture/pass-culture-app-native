import { SubcategoriesResponseModelv2 } from 'api/gen'
import { CategoriesModalView } from 'features/search/enums'
import { handleCategoriesSearchPress } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { CategoriesModalFormProps } from 'features/search/pages/modals/CategoriesModal/CategoriesModal'
import { NativeCategoryEnum, SearchState } from 'features/search/types'

export const getSearchParams = (
  nativeCategory: NativeCategoryEnum,
  subcategories: SubcategoriesResponseModelv2,
  searchState: SearchState
): Partial<SearchState> => {
  const offerCategories = searchState?.offerCategories

  if (!offerCategories[0]) return {}

  const form: CategoriesModalFormProps = {
    category: offerCategories[0],
    currentView: CategoriesModalView.GENRES,
    genreType: null,
    nativeCategory,
  }
  const searchParams = handleCategoriesSearchPress(form, subcategories)

  return {
    ...searchParams?.payload,
    isFullyDigitalOffersCategory: searchParams?.isFullyDigitalOffersCategory,
  }
}
