import React, { FunctionComponent } from 'react'
import { Dimensions, FlatList, ListRenderItem, Platform, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { CategoriesListHeader } from 'features/search/components/categories/CategoriesListHeader'
import { Gradient } from 'features/search/enums'
import { getMediaQueryFromDimensions } from 'libs/react-responsive/useMediaQuery'
import { CategoryButton } from 'shared/Buttons/CategoryButton'
import { theme } from 'theme'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export type CategoryButtonProps = {
  label: string
  Illustration?: FunctionComponent<AccessibleIcon>
  baseColor?: ColorsEnum
  gradients: Gradient
  onPress: () => void
  children?: never
  // v2 App Design
  textColor: ColorsEnum
  fillColor: ColorsEnum
  borderColor: ColorsEnum
}
export type ListCategoryButtonProps = CategoryButtonProps[]

type Props = {
  sortedCategories: ListCategoryButtonProps
  shouldDisplayVenueMap: boolean
  isMapWithoutPositionAndNotLocated: boolean
  showVenueMapLocationModal: () => void
  venueMapLocationModalVisible: boolean
  hideVenueMapLocationModal: () => void
  children?: never
}

const CATEGORY_BUTTON_HEIGHT_SEARCH = getSpacing(24.25)

const CategoryButtonItem: ListRenderItem<CategoryButtonProps> = ({ item }) => (
  <CategoryButtonContainer>
    <CategoryButton {...item} height={CATEGORY_BUTTON_HEIGHT_SEARCH} />
  </CategoryButtonContainer>
)

export const DumbCategoriesList: FunctionComponent<Props> = ({
  sortedCategories,
  shouldDisplayVenueMap,
  isMapWithoutPositionAndNotLocated,
  showVenueMapLocationModal,
  venueMapLocationModalVisible,
  hideVenueMapLocationModal,
}) => {
  const theme = useTheme()
  const numColumns = theme.isDesktopViewport ? 4 : 2

  return (
    <FlatList
      data={sortedCategories}
      renderItem={CategoryButtonItem}
      keyExtractor={(item) => item.label}
      numColumns={numColumns}
      key={numColumns} // update key to avoid the following error: Changing numColumns on the fly is not supported. Change the key prop on FlatList when changing the number of columns to force a fresh render of the component.
      ListHeaderComponent={CategoriesListHeader({
        shouldDisplayVenueMap,
        showVenueMapLocationModal,
        venueMapLocationModalVisible,
        hideVenueMapLocationModal,
        isMapWithoutPositionAndNotLocated,
      })}
      contentContainerStyle={contentContainerStyle}
      testID="categoriesButtons"
    />
  )
}

const tabletMinWidth = theme.breakpoints.md
// eslint-disable-next-line no-restricted-properties
const { width: windowWidth, height: windowHeight } = Dimensions.get('window')
const isMobileViewport = getMediaQueryFromDimensions({
  maxHeight: undefined,
  windowHeight,
  windowWidth,
  maxWidth: tabletMinWidth,
  minHeight: undefined,
  minWidth: undefined,
})

const contentContainerStyle = {
  paddingHorizontal: getSpacing(isMobileViewport ? 4 : 3),
  ...(Platform.OS === 'web'
    ? { paddingBottom: getSpacing(6) }
    : { paddingBottom: getSpacing(6) + theme.tabBar.height }),
}

// The FlatList uses numColumns which makes the list structure hard to achieve, so titles are used instead to structure the information
const CategoryButtonContainer = styled(View).attrs(getHeadingAttrs(3))(({ theme }) => ({
  padding: getSpacing(theme.isDesktopViewport ? 3 : 2),
  flexBasis: theme.isDesktopViewport ? '25%' : '50%',
}))
