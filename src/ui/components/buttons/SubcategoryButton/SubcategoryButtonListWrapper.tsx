import { useRoute } from '@react-navigation/native'
import React, { useMemo } from 'react'
import { ScrollViewProps, ViewStyle } from 'react-native'
import { useTheme } from 'styled-components/native'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { defaultDisabilitiesProperties } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { SearchStackRouteName } from 'features/navigation/SearchStackNavigator/types'
import { useSearch } from 'features/search/context/SearchWrapper'
import { CategoriesModalView, CATEGORY_CRITERIA } from 'features/search/enums'
import {
  handleCategoriesSearchPress,
  useNativeCategories,
} from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { useNavigateToSearch } from 'features/search/helpers/useNavigateToSearch/useNavigateToSearch'
import { CategoriesModalFormProps } from 'features/search/pages/modals/CategoriesModal/CategoriesModal'
import { NativeCategoryEnum, SearchState } from 'features/search/types'
import { useSubcategories } from 'libs/subcategories/useSubcategories'
import {
  SubcategoryButtonItem,
  SubcategoryButtonList,
} from 'ui/components/buttons/SubcategoryButton/SubcategoryButtonList'

type StyledScrollViewProps = ScrollViewProps & {
  contentContainerStyle?: ViewStyle
}

type Props = {
  offerCategory: SearchGroupNameEnumv2
  scrollViewProps?: StyledScrollViewProps
}

export const SubcategoryButtonListWrapper: React.FC<Props> = ({ offerCategory }) => {
  const { data: subcategories } = useSubcategories()

  const { colors } = useTheme()
  const nativeCategories = useNativeCategories(offerCategory)
  const offerCategoryTheme = useMemo(
    () => ({
      backgroundColor: CATEGORY_CRITERIA[offerCategory]?.fillColor,
      borderColor: CATEGORY_CRITERIA[offerCategory]?.borderColor,
    }),
    [offerCategory]
  )

  const { navigateToSearch: navigateToSearchResults } = useNavigateToSearch('SearchResults')
  const { params } = useRoute<UseRouteType<SearchStackRouteName>>()
  const { dispatch, searchState } = useSearch()
  const subcategoryButtonContent = useMemo(
    () =>
      nativeCategories.map(
        (nativeCategory): SubcategoryButtonItem => ({
          label: nativeCategory[1].label,
          backgroundColor: offerCategoryTheme.backgroundColor || colors.white,
          borderColor: offerCategoryTheme.borderColor || colors.black,
          nativeCategory: nativeCategory[0] as NativeCategoryEnum,
        })
      ),
    [
      colors.black,
      colors.white,
      nativeCategories,
      offerCategoryTheme.backgroundColor,
      offerCategoryTheme.borderColor,
    ]
  )

  if (!subcategories) return null

  const handleSubcategoryButtonPress = (nativeCategory: NativeCategoryEnum) => {
    const offerCategories = params?.offerCategories as SearchGroupNameEnumv2[]
    const form: CategoriesModalFormProps = {
      category: offerCategories?.[0] as SearchGroupNameEnumv2,
      currentView: CategoriesModalView.GENRES,
      genreType: null,
      nativeCategory,
    }
    const searchPayload = handleCategoriesSearchPress(form, subcategories)

    const additionalSearchState: SearchState = {
      ...searchState,
      ...searchPayload?.payload,
      offerCategories,
      isFullyDigitalOffersCategory: searchPayload?.isFullyDigitalOffersCategory || undefined,
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
