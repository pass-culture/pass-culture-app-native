import { useRoute } from '@react-navigation/native'
import React, { useMemo } from 'react'
import { useTheme } from 'styled-components/native'

import { defaultDisabilitiesProperties } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import {
  SearchStackRouteName,
  ThematicSearchCategories,
} from 'features/navigation/SearchStackNavigator/types'
import { useSearch } from 'features/search/context/SearchWrapper'
import { CATEGORY_APPEARANCE } from 'features/search/enums'
import {
  BaseCategory,
  buildSearchPayloadValues,
  getCategoryChildren,
  sortCategoriesPredicate,
} from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { useNavigateToSearch } from 'features/search/helpers/useNavigateToSearch/useNavigateToSearch'
import { SearchState } from 'features/search/types'
import {
  SubcategoryButtonItem,
  SubcategoryButtonList,
} from 'ui/components/buttons/SubcategoryButton/SubcategoryButtonList'

type Props = {
  category: ThematicSearchCategories
}

export const SubcategoryButtonListWrapper: React.FC<Props> = ({ category }) => {
  const { colors } = useTheme()
  const subcategories: BaseCategory[] = getCategoryChildren(category)
  const offerCategoryTheme = useMemo(
    () => ({
      backgroundColor: CATEGORY_APPEARANCE[category]?.fillColor,
      borderColor: CATEGORY_APPEARANCE[category]?.borderColor,
    }),
    [category]
  )

  const { navigateToSearch: navigateToSearchResults } = useNavigateToSearch('SearchResults')
  const { params } = useRoute<UseRouteType<SearchStackRouteName>>()
  const { dispatch, searchState } = useSearch()
  const subcategoryButtonContent = useMemo(
    () =>
      subcategories
        .toSorted((a, b) => sortCategoriesPredicate(a, b))
        .map(
          (subcategory): SubcategoryButtonItem => ({
            label: subcategory.label,
            backgroundColor: offerCategoryTheme.backgroundColor ?? colors.white,
            borderColor: offerCategoryTheme.borderColor ?? colors.black,
            categoryKey: subcategory.key,
            position: subcategory.position,
          })
        ),
    [
      colors.black,
      colors.white,
      subcategories,
      offerCategoryTheme.backgroundColor,
      offerCategoryTheme.borderColor,
    ]
  )

  if (!subcategories) return null

  const handleSubcategoryButtonPress = () => {
    const offerCategories = params?.offerCategories ?? []
    const searchPayload = buildSearchPayloadValues(subcategories)

    const additionalSearchState: SearchState = {
      ...searchState,
      ...searchPayload,
      offerCategories,
    }

    dispatch({ type: 'SET_STATE', payload: additionalSearchState })
    navigateToSearchResults(additionalSearchState, defaultDisabilitiesProperties)
  }
  return (
    <SubcategoryButtonList
      subcategoryButtonContent={subcategoryButtonContent}
      onPress={handleSubcategoryButtonPress}
    />
  )
}
