import React, { FunctionComponent } from 'react'
import { Dimensions, FlatList, ListRenderItem, Platform, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import {
  CategoryButton,
  CategoryButtonProps,
} from 'features/search/components/CategoryButton/CategoryButton'
import { VenueMapBlock } from 'features/venueMap/components/VenueMapBlock/VenueMapBlock'
import { useShouldDisplayVenueMap } from 'features/venueMap/hook/useShouldDisplayVenueMap'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { LocationMode } from 'libs/location/types'
import { getMediaQueryFromDimensions } from 'libs/react-responsive/useMediaQuery'
import { theme } from 'theme'
import { getSpacing, Spacer, Typo } from 'ui/theme'
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

export const CategoriesButtonsDisplay: FunctionComponent<Props> = ({ sortedCategories }) => {
  const { shouldDisplayVenueMap, hasGeolocPosition, selectedLocationMode } =
    useShouldDisplayVenueMap()
  const hasVenueMapWithoutPosition =
    useFeatureFlag(RemoteStoreFeatureFlags.WIP_VENUE_MAP_WITHOUT_POSITION) || true

  const isNotLocated = selectedLocationMode === LocationMode.EVERYWHERE && !hasGeolocPosition

  const isMapWithoutPositionAndNotLocated = hasVenueMapWithoutPosition && isNotLocated

  const theme = useTheme()
  const numColumns = theme.isDesktopViewport ? 4 : 2

  const handlePress = () => {
    // eslint-disable-next-line no-console
    console.log('Button pressed')
  }

  return (
    <FlatList
      data={sortedCategories}
      renderItem={CategoryButtonItem}
      keyExtractor={(item) => item.label}
      numColumns={numColumns}
      key={numColumns} // update key to avoid the following error: Changing numColumns on the fly is not supported. Change the key prop on FlatList when changing the number of columns to force a fresh render of the component.
      ListHeaderComponent={
        <React.Fragment>
          {isMapWithoutPositionAndNotLocated || shouldDisplayVenueMap ? (
            <React.Fragment>
              <Spacer.Column numberOfSpaces={4} />
              <VenueMapBlock
                onPress={isMapWithoutPositionAndNotLocated ? handlePress : undefined}
              />
              <Spacer.Column numberOfSpaces={2} />
            </React.Fragment>
          ) : null}

          <CategoriesTitle />
        </React.Fragment>
      }
      contentContainerStyle={contentContainerStyle}
      testID="categoriesButtons"
    />
  )
}

const CategoriesTitle = styled(Typo.Title3).attrs({
  children: 'Explore les catégories',
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
  // paddingHorizontal: getSpacing(theme.isDesktopViewport ? 3 : 4),
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
