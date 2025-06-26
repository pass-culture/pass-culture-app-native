import React from 'react'
import { PixelRatio } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { OfferPlaylistSkeleton, TileSize } from 'ui/components/placeholders/OfferPlaylistSkeleton'
import { SkeletonTile } from 'ui/components/placeholders/SkeletonTile'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing, MARGIN_DP, RATIO_BUSINESS } from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'

export const HomeBodyPlaceholder = () => (
  <ViewGap gap={6}>
    <OfferPlaylistSkeleton size={TileSize.LARGE} numberOfTiles={4} />
    <OfferPlaylistSkeleton size={TileSize.MEDIUM} numberOfTiles={5} />
    <Container testID="HomeBodyPlaceholder-testID">
      <BusinessModulePlaceholder />
    </Container>
    <OfferPlaylistSkeleton size={TileSize.MEDIUM} numberOfTiles={5} />
    <OfferPlaylistSkeleton size={TileSize.LARGE} numberOfTiles={4} />
  </ViewGap>
)

const BusinessModulePlaceholder = () => {
  const { appContentWidth } = useTheme()
  const width = appContentWidth - 2 * MARGIN_DP
  const height = PixelRatio.roundToNearestPixel(width * RATIO_BUSINESS)
  return (
    <SkeletonTile height={height} width={width} borderRadius={BorderRadiusEnum.BORDER_RADIUS} />
  )
}

const Container = styled.View({
  flexDirection: 'row',
  paddingBottom: getSpacing(6),
  paddingLeft: getSpacing(6),
})
