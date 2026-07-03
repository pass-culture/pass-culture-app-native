import { useMemo } from 'react'
import { useTheme } from 'styled-components/native'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { useSearch } from 'features/search/context/SearchWrapper'
import { CATEGORY_CRITERIA } from 'features/search/enums'
import {
  sortCategoriesPredicate,
  useNativeCategories,
} from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { NativeCategoryEnum } from 'features/search/types'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { useSubcategoriesQuery } from 'queries/subcategories/useSubcategoriesQuery'
import { getSearchParams } from 'ui/components/buttons/SubcategoryButton/helpers'
import { SubcategoryButtonItem } from 'ui/components/buttons/SubcategoryButton/SubcategoryButton'

export const useSubcategoryButtonContent = (
  offerCategory?: SearchGroupNameEnumv2
): SubcategoryButtonItem[] => {
  const { data: subcategories = PLACEHOLDER_DATA } = useSubcategoriesQuery()
  const { searchState, dispatch } = useSearch()

  const { designSystem } = useTheme()
  const nativeCategories = useNativeCategories(offerCategory)
  const offerCategoryTheme = useMemo(
    () => ({
      backgroundColor: offerCategory ? CATEGORY_CRITERIA[offerCategory]?.fillColor : undefined,
      borderColor: offerCategory ? CATEGORY_CRITERIA[offerCategory]?.borderColor : undefined,
    }),
    [offerCategory]
  )

  return useMemo(() => {
    if (!offerCategory) return []
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
          backgroundColor:
            designSystem.color.background[offerCategoryTheme.backgroundColor ?? 'default'],
          borderColor: designSystem.color.border[offerCategoryTheme.borderColor ?? 'default'],
          nativeCategory: nativeCategory[0] as NativeCategoryEnum,
          position: nativeCategory[1].position,
          searchParams,
          onBeforeNavigate: () => dispatch({ type: 'SET_STATE', payload: searchParams }),
        }
      })
      .sort((a, b) => sortCategoriesPredicate(a, b))
  }, [
    dispatch,
    nativeCategories,
    offerCategory,
    offerCategoryTheme.backgroundColor,
    offerCategoryTheme.borderColor,
    searchState,
    subcategories,
    designSystem.color.background,
    designSystem.color.border,
  ])
}
