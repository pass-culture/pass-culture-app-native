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
  CategoryKey,
  getCategoryChildren,
  sortCategoriesPredicate,
} from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { useNavigateToSearch } from 'features/search/helpers/useNavigateToSearch/useNavigateToSearch'
import {
  SubcategoryButtonItem,
  SubcategoryButtonList,
} from 'ui/components/buttons/SubcategoryButton/SubcategoryButtonList'

type Props = {
  category: ThematicSearchCategories
}

export const SubcategoryButtonListWrapper: React.FC<Props> = ({ category }) => {
  const { colors } = useTheme()
  const subcategories = getCategoryChildren(category)

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
            backgroundColor: CATEGORY_APPEARANCE[category]?.fillColor ?? colors.white,
            borderColor: CATEGORY_APPEARANCE[category]?.borderColor ?? colors.black,
            categoryKey: subcategory.key,
            position: subcategory.position,
          })
        ),
    [colors.black, colors.white, subcategories]
  )

  if (!subcategories) return null

  const handleSubcategoryButtonPress = (subcategory: CategoryKey) => {
    const offerCategories = [...(params?.offerCategories ?? []), subcategory]
    const newSearchState = { ...searchState, offerCategories }

    dispatch({ type: 'SET_STATE', payload: newSearchState })
    navigateToSearchResults(newSearchState, defaultDisabilitiesProperties)
  }
  return (
    <SubcategoryButtonList
      subcategoryButtonContent={subcategoryButtonContent}
      onPress={handleSubcategoryButtonPress}
    />
  )
}
