import React from 'react'
import { View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { DefaultTheme, useTheme } from 'styled-components'
import styled from 'styled-components/native'

import {
  VENUE_ITEM_HEIGHT,
  VENUE_ITEM_WIDTH,
} from 'features/search/components/VenuePlaylist/VenuePlaylist'
import {
  SUBCATEGORY_BUTTON_HEIGHT,
  SUBCATEGORY_BUTTON_WIDTH,
} from 'ui/components/buttons/SubcategoryButton/SubcategoryButton'
import {
  ModuleTitlePlaceholder,
  OfferPlaylistSkeleton,
  TextPlaceholder,
  TileSize,
} from 'ui/components/placeholders/OfferPlaylistSkeleton'
import { SkeletonTile } from 'ui/components/placeholders/SkeletonTile'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing } from 'ui/theme'

const FlatlistSkeleton: React.FC<{
  numberOfTiles: number
  renderPlaceholder: () => React.JSX.Element
  paddingBottom: number
}> = ({ numberOfTiles, renderPlaceholder, paddingBottom }) => {
  const data = new Array(numberOfTiles)
    .fill(null)
    .map((_, index: number) => ({ key: index.toString() }))

  return (
    <FlatListContainer paddingBottom={paddingBottom}>
      <FlatList
        horizontal
        data={data}
        renderItem={renderPlaceholder}
        showsHorizontalScrollIndicator={false}
      />
    </FlatListContainer>
  )
}

const renderSubcategoryButtonSkeleton = (theme: DefaultTheme) => {
  return (
    <SkeletonTileContainer>
      <SkeletonTile
        width={SUBCATEGORY_BUTTON_WIDTH}
        height={SUBCATEGORY_BUTTON_HEIGHT}
        borderRadius={theme.borderRadius.radius}
      />
    </SkeletonTileContainer>
  )
}
const renderVenuePlaylistSkeleton = (theme: DefaultTheme) => {
  return (
    <StyledViewGap gap={1}>
      <VenuePlaylistSkeletonTile
        width={VENUE_ITEM_WIDTH}
        height={VENUE_ITEM_HEIGHT}
        borderRadius={theme.borderRadius.radius}
      />
      <TextPlaceholder width={VENUE_ITEM_WIDTH * 0.9} />
      <TextPlaceholder width={VENUE_ITEM_WIDTH * 0.4} />
      <TextPlaceholder width={VENUE_ITEM_WIDTH * 0.5} />
    </StyledViewGap>
  )
}

const TitleVenuePlaylistSkeleton: React.FC = () => (
  <VenuePlaylistTitlesContainer>
    <ModuleTitlePlaceholder />
    <TextPlaceholder width={100} />
  </VenuePlaylistTitlesContainer>
)

export const ThematicSearchSkeleton = () => {
  const theme = useTheme()

  return (
    <View testID="ThematicSearchSkeleton">
      <FlatlistSkeleton
        numberOfTiles={5}
        renderPlaceholder={() => renderSubcategoryButtonSkeleton(theme)}
        paddingBottom={getSpacing(8)}
      />
      <TitleVenuePlaylistSkeleton />
      <FlatlistSkeleton
        numberOfTiles={6}
        renderPlaceholder={() => renderVenuePlaylistSkeleton(theme)}
        paddingBottom={getSpacing(6)}
      />
      <OfferPlaylistSkeleton size={TileSize.MEDIUM} numberOfTiles={6} />
    </View>
  )
}

const FlatListContainer = styled.View<{ paddingBottom: number }>(({ paddingBottom }) => ({
  flexDirection: 'column',
  paddingTop: getSpacing(6),
  paddingLeft: getSpacing(6),
  paddingBottom,
}))

const VenuePlaylistSkeletonTile = styled(SkeletonTile)({ paddingBottom: getSpacing(2) })

const VenuePlaylistTitlesContainer = styled.View({
  flexDirection: 'column',
  marginLeft: getSpacing(6),
  gap: getSpacing(5),
})

const SkeletonTileContainer = styled.View({
  paddingRight: getSpacing(2.5),
})

const StyledViewGap = styled(ViewGap)({
  paddingRight: getSpacing(2.5),
  marginBottom: getSpacing(5),
})
