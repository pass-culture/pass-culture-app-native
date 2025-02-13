import {
  NativeCategoryIdEnumv2,
  SearchGroupNameEnumv2,
  SubcategoriesResponseModelv2,
} from 'api/gen'
import { CategoriesModalView } from 'features/search/enums'
import { handleCategoriesSearchPress } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { CategoriesModalFormProps } from 'features/search/pages/modals/CategoriesModal/CategoriesModal'
import { BooksNativeCategoriesEnum, SearchState } from 'features/search/types'

export const getSearchParams = (
  nativeCategory: NativeCategoryIdEnumv2 | BooksNativeCategoriesEnum,
  offerCategory: SearchGroupNameEnumv2,
  subcategories: SubcategoriesResponseModelv2,
  searchState: SearchState
): SearchState => {
  const form: CategoriesModalFormProps = {
    category: offerCategory,
    currentView: CategoriesModalView.GENRES,
    genreType: null,
    nativeCategory,
  }
  const searchParams = handleCategoriesSearchPress(form, subcategories)

  const { offerNativeCategories } = getOfferNativeCategories(nativeCategory)(isBookNativeCategory)

  return {
    ...searchState,
    ...searchParams?.payload,
    offerCategories: [offerCategory],
    offerNativeCategories,
    isFullyDigitalOffersCategory: searchParams?.isFullyDigitalOffersCategory,
  }
}

const getOfferNativeCategories =
  (category: NativeCategoryIdEnumv2 | BooksNativeCategoriesEnum) =>
  (predicate: typeof isBookNativeCategory) => {
    if (predicate(category)) {
      const bookNativeCategory: BooksNativeCategoriesEnum[] = [category]
      return { offerNativeCategories: bookNativeCategory }
    } else {
      const nativeCategory: NativeCategoryIdEnumv2[] = [category]
      return { offerNativeCategories: nativeCategory }
    }
  }

function isBookNativeCategory(
  category: NativeCategoryIdEnumv2 | BooksNativeCategoriesEnum
): category is BooksNativeCategoriesEnum {
  return Object.values(BooksNativeCategoriesEnum).includes(category as BooksNativeCategoriesEnum)
}
