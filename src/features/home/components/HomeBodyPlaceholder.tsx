import React from 'react'
import { View, PixelRatio } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { OfferPlaylistSkeleton } from 'ui/components/placeholders/OfferPlaylistSkeleton'
import { SkeletonTile } from 'ui/components/placeholders/SkeletonTile'
import { getSpacing, LENGTH_L, LENGTH_M, MARGIN_DP, RATIO_BUSINESS, Spacer } from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'

export const HomeBodyPlaceholder = () => (
  <View>
    <OfferPlaylistSkeleton size={LENGTH_L} numberOfTiles={4} />
    <Spacer.Column numberOfSpaces={6} />
    <OfferPlaylistSkeleton size={LENGTH_M} numberOfTiles={5} />
    <Spacer.Column numberOfSpaces={6} />
    <Container testID="HomeBodyPlaceholder-testID">
      <Spacer.Row numberOfSpaces={6} />
      <BusinessModulePlaceholder />
    </Container>
    <Spacer.Column numberOfSpaces={6} />
    <OfferPlaylistSkeleton size={LENGTH_M} numberOfTiles={5} />
    <Spacer.Column numberOfSpaces={6} />
    <OfferPlaylistSkeleton size={LENGTH_L} numberOfTiles={4} />
  </View>
)

const BusinessModulePlaceholder = () => {
  const { appContentWidth } = useTheme()
  const width = appContentWidth - 2 * MARGIN_DP
  const height = PixelRatio.roundToNearestPixel(width * RATIO_BUSINESS)
  return (
    <SkeletonTile height={height} width={width} borderRadius={BorderRadiusEnum.BORDER_RADIUS} />
  )
}

const Container = styled.View({ flexDirection: 'row', paddingBottom: getSpacing(6) })
