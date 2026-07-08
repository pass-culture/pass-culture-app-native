import type { Dispatch } from 'react'

import {
  NativeCategoryIdEnumv2,
  SearchGroupNameEnumv2,
  SubcategoriesResponseModelv2,
} from 'api/gen'
import { Action } from 'features/search/context/reducer'
import { CategoriesModalView } from 'features/search/enums'
import {
  handleCategoriesSearchPress,
  sortCategoriesPredicate,
} from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import type { useNativeCategories } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { CategoriesModalFormProps } from 'features/search/pages/modals/CategoriesModal/CategoriesModal'
import { BooksNativeCategoriesEnum, NativeCategoryEnum, SearchState } from 'features/search/types'
import { BackgroundColorKey, BorderColorKey, ColorsType } from 'theme/types'
import { SubcategoryButtonItem } from 'ui/components/buttons/SubcategoryButton/SubcategoryButton'

type SubcategoryButtonTheme = {
  backgroundColor: BackgroundColorKey
  borderColor: BorderColorKey
}

type ThematicSearchCategory = Exclude<SearchGroupNameEnumv2, SearchGroupNameEnumv2.NONE>

const SUBCATEGORY_BUTTON_THEME_BY_CATEGORY = {
  [SearchGroupNameEnumv2.CONCERTS_FESTIVALS]: {
    backgroundColor: 'decorative01',
    borderColor: 'decorative01',
  },
  [SearchGroupNameEnumv2.CINEMA]: {
    backgroundColor: 'decorative02',
    borderColor: 'decorative02',
  },
  [SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES]: {
    backgroundColor: 'decorative04',
    borderColor: 'decorative04',
  },
  [SearchGroupNameEnumv2.LIVRES]: {
    backgroundColor: 'decorative05',
    borderColor: 'decorative05',
  },
  [SearchGroupNameEnumv2.MUSIQUE]: {
    backgroundColor: 'decorative03',
    borderColor: 'decorative03',
  },
  [SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS]: {
    backgroundColor: 'decorative02',
    borderColor: 'decorative02',
  },
  [SearchGroupNameEnumv2.SPECTACLES]: {
    backgroundColor: 'decorative05',
    borderColor: 'decorative05',
  },
  [SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES]: {
    backgroundColor: 'decorative01',
    borderColor: 'decorative01',
  },
  [SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS]: {
    backgroundColor: 'decorative04',
    borderColor: 'decorative04',
  },
  [SearchGroupNameEnumv2.MEDIA_PRESSE]: {
    backgroundColor: 'decorative04',
    borderColor: 'decorative04',
  },
  [SearchGroupNameEnumv2.CARTES_JEUNES]: {
    backgroundColor: 'decorative01',
    borderColor: 'decorative01',
  },
  [SearchGroupNameEnumv2.RENCONTRES_CONFERENCES]: {
    backgroundColor: 'decorative03',
    borderColor: 'decorative03',
  },
  [SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE]: {
    backgroundColor: 'decorative04',
    borderColor: 'decorative04',
  },
} satisfies Record<ThematicSearchCategory, SubcategoryButtonTheme>

const getSubcategoryButtonTheme = (offerCategory: SearchGroupNameEnumv2): SubcategoryButtonTheme =>
  offerCategory === SearchGroupNameEnumv2.NONE
    ? { backgroundColor: 'default', borderColor: 'default' }
    : SUBCATEGORY_BUTTON_THEME_BY_CATEGORY[offerCategory]

type NativeCategories = ReturnType<typeof useNativeCategories>

type GetSubcategoryButtonContentParams = {
  nativeCategories: NativeCategories
  offerCategory?: SearchGroupNameEnumv2
  subcategories: SubcategoriesResponseModelv2
  searchState: SearchState
  dispatch: Dispatch<Action>
  backgroundColors: Record<BackgroundColorKey, ColorsType>
  borderColors: Record<BorderColorKey, ColorsType>
}

export const getSubcategoryButtonContent = ({
  nativeCategories,
  offerCategory,
  subcategories,
  searchState,
  dispatch,
  backgroundColors,
  borderColors,
}: GetSubcategoryButtonContentParams): SubcategoryButtonItem[] => {
  if (!offerCategory) return []

  const offerCategoryTheme = getSubcategoryButtonTheme(offerCategory)

  return nativeCategories
    .map((nativeCategory): SubcategoryButtonItem => {
      const searchParams = getSearchParams(
        nativeCategory[0] as NativeCategoryEnum,
        offerCategory,
        subcategories,
        searchState
      )

      return {
        label: nativeCategory[1].label,
        backgroundColor: backgroundColors[offerCategoryTheme.backgroundColor],
        borderColor: borderColors[offerCategoryTheme.borderColor],
        nativeCategory: nativeCategory[0] as NativeCategoryEnum,
        position: nativeCategory[1].position,
        searchParams,
        onBeforeNavigate: () => dispatch({ type: 'SET_STATE', payload: searchParams }),
      }
    })
    .sort((a, b) => sortCategoriesPredicate(a, b))
}

const getSearchParams = (
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
