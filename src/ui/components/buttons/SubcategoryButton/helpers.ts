import {
  NativeCategoryIdEnumv2,
  SearchGroupNameEnumv2,
  SubcategoriesResponseModelv2,
} from 'api/gen'
import { CategoriesModalView } from 'features/search/enums'
import { handleCategoriesSearchPress } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { CategoriesModalFormProps } from 'features/search/pages/modals/CategoriesModal/CategoriesModal'
import { BooksNativeCategoriesEnum, NativeCategoryEnum, SearchState } from 'features/search/types'

export const getSearchParams = (
  nativeCategory: NativeCategoryEnum,
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

  const { offerNativeCategories } = getOfferNativeCategories(nativeCategory)

  return {
    ...searchState,
    ...searchParams?.payload,
    offerCategories: [offerCategory],
    offerNativeCategories,
    isFullyDigitalOffersCategory: searchParams?.isFullyDigitalOffersCategory,
  }
}

// TODO(PC-34768) : typing of field offerNativeCategories in SearchState should be rethink to avoid having to write code that corrects invalid type
const getOfferNativeCategories = (category: NativeCategoryEnum) => {
  if (isBookNativeCategory(category)) {
    const bookNativeCategory: BooksNativeCategoriesEnum[] = [category]
    return { offerNativeCategories: bookNativeCategory }
  } else {
    const nativeCategory: NativeCategoryIdEnumv2[] = [category]
    return { offerNativeCategories: nativeCategory }
  }
}

function isBookNativeCategory(category: NativeCategoryEnum): category is BooksNativeCategoriesEnum {
  return Object.values(BooksNativeCategoriesEnum).includes(category as BooksNativeCategoriesEnum)
}
