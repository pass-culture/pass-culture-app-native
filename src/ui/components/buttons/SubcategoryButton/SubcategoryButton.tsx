import { useRoute } from '@react-navigation/native'
import React from 'react'
import { useWindowDimensions, Platform } from 'react-native'
import styled from 'styled-components/native'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { defaultDisabilitiesProperties } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { SearchStackRouteName } from 'features/navigation/SearchStackNavigator/types'
import { useSearch } from 'features/search/context/SearchWrapper'
import { CategoriesModalView } from 'features/search/enums'
import { handleCategoriesSearchPress } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { useNavigateToSearch } from 'features/search/helpers/useNavigateToSearch/useNavigateToSearch'
import { CategoriesModalFormProps } from 'features/search/pages/modals/CategoriesModal/CategoriesModal'
import { NativeCategoryEnum, SearchState } from 'features/search/types'
import { useSubcategories } from 'libs/subcategories/useSubcategories'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { getShadow, Typo } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import type { ColorsEnum } from 'ui/theme/colors'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'
import { getHoverStyle } from 'ui/theme/getHoverStyle/getHoverStyle'
import { getSpacing } from 'ui/theme/spacing'

export type SubcategoryButtonProps = {
  label: string
  backgroundColor: ColorsEnum
  borderColor: ColorsEnum
  nativeCategory: NativeCategoryEnum
}

export const SUBCATEGORY_BUTTON_HEIGHT = getSpacing(14)
export const SUBCATEGORY_BUTTON_WIDTH = getSpacing(45.6)

export const SubcategoryButton = ({
  label,
  backgroundColor,
  borderColor,
  nativeCategory,
}: SubcategoryButtonProps) => {
  const { data: subcategories } = useSubcategories()
  const { navigateToSearch: navigateToSearchResults } = useNavigateToSearch('SearchResults')
  const { params } = useRoute<UseRouteType<SearchStackRouteName>>()
  const { dispatch, searchState } = useSearch()
  const windowWidth = useWindowDimensions().width

  const handleSubcategoryButtonPress = () => {
    if (!subcategories) return

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
    <StyledTouchable
      onPress={handleSubcategoryButtonPress}
      testID={`SubcategoryButton ${label}`}
      accessibilityLabel={label}
      windowWidth={windowWidth}
      backgroundColor={backgroundColor}
      borderColor={borderColor}>
      <StyledText>{label}</StyledText>
    </StyledTouchable>
  )
}

const StyledTouchable = styledButton(Touchable)<{
  isFocus?: boolean
  windowWidth: number
  backgroundColor: ColorsEnum
  borderColor: ColorsEnum
}>(({ theme, isFocus, windowWidth, backgroundColor, borderColor }) => ({
  flexDirection: 'row',
  backgroundColor,
  height: SUBCATEGORY_BUTTON_HEIGHT,
  ...(theme.isMobileViewport
    ? {
        width: windowWidth / 2 - getSpacing(8),
        maxWidth: SUBCATEGORY_BUTTON_WIDTH,
      }
    : { width: SUBCATEGORY_BUTTON_WIDTH }),
  borderColor,
  borderWidth: 1.6,
  borderRadius: theme.borderRadius.radius,
  ...getShadow({
    shadowOffset: { width: 0, height: getSpacing(1) },
    shadowRadius: getSpacing(1),
    shadowColor: theme.colors.greyDark,
    shadowOpacity: 0.2,
  }),
  ...customFocusOutline({ isFocus, color: theme.colors.black }),
  textAlign: 'left',
  alignItems: 'center',
  padding: getSpacing(2),
}))

const StyledText = styled(Typo.Caption).attrs({
  ellipsizeMode: 'tail',
  numberOfLines: 2,
  ...(Platform.OS === 'ios' && { paddingRight: getSpacing(4) }),
})<{ isHover?: boolean }>(({ theme, isHover }) => ({
  ...getHoverStyle(theme.colors.black, isHover),
}))
