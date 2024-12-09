import React from 'react'
import { FlatList } from 'react-native-gesture-handler'
import styled from 'styled-components/native'

import { theme } from 'theme'
import {
  SUBCATEGORY_BUTTON_HEIGHT,
  SUBCATEGORY_BUTTON_WIDTH,
} from 'ui/components/buttons/SubcategoryButton/SubcategoryButton'
import { OfferPlaylistSkeleton, TileSize } from 'ui/components/placeholders/OfferPlaylistSkeleton'
import { SkeletonTile } from 'ui/components/placeholders/SkeletonTile'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing } from 'ui/theme'

const SubcategoryButtonListSkeleton: React.FC<{ numberOfTiles: number }> = ({ numberOfTiles }) => {
  const data = new Array(numberOfTiles)
    .fill(null)
    .map((_, index: number) => ({ key: index.toString() }))

  const renderPlaceholder = () => (
    <SkeletonTileContainer>
      <SkeletonTile
        width={SUBCATEGORY_BUTTON_WIDTH}
        height={SUBCATEGORY_BUTTON_HEIGHT}
        borderRadius={theme.borderRadius.radius}
      />
    </SkeletonTileContainer>
  )

  return (
    <FlatListContainer>
      <FlatList
        horizontal
        data={data}
        renderItem={renderPlaceholder}
        showsHorizontalScrollIndicator={false}
      />
    </FlatListContainer>
  )
}

export const ThematicSearchSkeleton: React.FC = () => (
  <ViewGap gap={10} testID="ThematicSearchSkeleton">
    <SubcategoryButtonListSkeleton numberOfTiles={5} />
    <OfferPlaylistSkeleton size={TileSize.MEDIUM} numberOfTiles={6} />
    <OfferPlaylistSkeleton size={TileSize.MEDIUM} numberOfTiles={6} />
  </ViewGap>
)

const FlatListContainer = styled.View({
  flexDirection: 'row',
  paddingTop: getSpacing(2),
  paddingLeft: getSpacing(6),
})

const SkeletonTileContainer = styled.View({ paddingRight: getSpacing(2.5) })
