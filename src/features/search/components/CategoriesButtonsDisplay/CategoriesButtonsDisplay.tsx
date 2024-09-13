import React, { FunctionComponent } from 'react'
import { Dimensions, FlatList, ListRenderItem, Platform, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { VenueMapLocationModal } from 'features/location/components/VenueMapLocationModal'
import {
  CategoryButton,
  CategoryButtonProps,
} from 'features/search/components/CategoryButton/CategoryButton'
import { CategoryButtonV2 } from 'features/search/components/CategoryButton/CategoryButtonV2'
import { VenueMapBlock } from 'features/venueMap/components/VenueMapBlock/VenueMapBlock'
import { useShouldDisplayVenueMap } from 'features/venueMap/hook/useShouldDisplayVenueMap'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { LocationMode } from 'libs/location/types'
import { getMediaQueryFromDimensions } from 'libs/react-responsive/useMediaQuery'
import { theme } from 'theme'
import { useModal } from 'ui/components/modals/useModal'
import { getSpacing, Spacer, TypoDS } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export type ListCategoryButtonProps = CategoryButtonProps[]

type Props = {
  sortedCategories: ListCategoryButtonProps
  children?: never
}

const CategoryButtonItem: ListRenderItem<CategoryButtonProps> = ({ item }) => (
  <CategoryButtonContainer>
    <CategoryButton {...item} />
  </CategoryButtonContainer>
)
const CategoryButtonItemV2: ListRenderItem<CategoryButtonProps> = ({ item }) => (
  <CategoryButtonContainer>
    <CategoryButtonV2 {...item} />
  </CategoryButtonContainer>
)

const isWeb = Platform.OS === 'web'

export const CategoriesButtonsDisplay: FunctionComponent<Props> = ({ sortedCategories }) => {
  const { shouldDisplayVenueMap, selectedLocationMode } = useShouldDisplayVenueMap()
  const enableNewCategoryBlock = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_APP_V2_SEARCH_CATEGORY_BLOCK
  )

  const {
    showModal: showVenueMapLocationModal,
    visible: venueMapLocationModalVisible,
    hideModal: hideVenueMapLocationModal,
  } = useModal()

  const isLocated = selectedLocationMode !== LocationMode.EVERYWHERE

  const isMapWithoutPositionAndNotLocated = !isLocated && !isWeb

  const theme = useTheme()
  const numColumns = theme.isDesktopViewport ? 4 : 2

  return (
    <FlatList
      data={sortedCategories}
      renderItem={enableNewCategoryBlock ? CategoryButtonItemV2 : CategoryButtonItem}
      keyExtractor={(item) => item.label}
      numColumns={numColumns}
      key={numColumns} // update key to avoid the following error: Changing numColumns on the fly is not supported. Change the key prop on FlatList when changing the number of columns to force a fresh render of the component.
      ListHeaderComponent={
        <React.Fragment>
          {isMapWithoutPositionAndNotLocated || shouldDisplayVenueMap ? (
            <React.Fragment>
              <Spacer.Column numberOfSpaces={4} />
              <VenueMapBlock
                onPress={isMapWithoutPositionAndNotLocated ? showVenueMapLocationModal : undefined}
                from="searchLanding"
              />
              <Spacer.Column numberOfSpaces={2} />
            </React.Fragment>
          ) : null}

          {enableNewCategoryBlock ? <CategoriesTitleV2 /> : <CategoriesTitle />}
          <VenueMapLocationModal
            visible={venueMapLocationModalVisible}
            dismissModal={hideVenueMapLocationModal}
          />
        </React.Fragment>
      }
      contentContainerStyle={contentContainerStyle}
      testID="categoriesButtons"
    />
  )
}

const CategoriesTitle = styled(TypoDS.Title3).attrs({
  children: 'Explore les catégories',
  ...getHeadingAttrs(2),
})(({ theme }) => ({
  marginTop: getSpacing(4),
  marginBottom: getSpacing(theme.isDesktopViewport ? 1 : 2),
  paddingHorizontal: getSpacing(2),
}))
const CategoriesTitleV2 = styled(TypoDS.Title4).attrs({
  children: 'Parcours les catégories',
  ...getHeadingAttrs(2),
})(({ theme }) => ({
  marginTop: getSpacing(4),
  marginBottom: getSpacing(theme.isDesktopViewport ? 1 : 2),
  paddingHorizontal: getSpacing(2),
}))

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
