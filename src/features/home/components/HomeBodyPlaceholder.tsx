import React, { memo, useCallback } from 'react'
import { View, PixelRatio } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import styled, { useTheme } from 'styled-components/native'

import { SkeletonTile } from 'features/home/atoms/SkeletonTile'
import {
  getSpacing,
  LENGTH_L,
  LENGTH_M,
  MARGIN_DP,
  RATIO_HOME_IMAGE,
  RATIO_BUSINESS,
  Spacer,
  Typo,
} from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

enum TileSize {
  M = LENGTH_M,
  L = LENGTH_L,
}

export const HomeBodyPlaceholder = () => (
  <View>
    <OfferModulePlaceholder size={LENGTH_L} numberOfTiles={4} />
    <Spacer.Column numberOfSpaces={6} />
    <OfferModulePlaceholder size={LENGTH_M} numberOfTiles={5} />
    <Spacer.Column numberOfSpaces={6} />
    <Container testID="HomeBodyPlaceholder-testID">
      <Spacer.Row numberOfSpaces={6} />
      <BusinessModulePlaceholder />
    </Container>
    <Spacer.Column numberOfSpaces={6} />
    <OfferModulePlaceholder size={LENGTH_M} numberOfTiles={5} />
    <Spacer.Column numberOfSpaces={6} />
    <OfferModulePlaceholder size={LENGTH_L} numberOfTiles={4} />
  </View>
)

const UnmemoizedOfferModulePlaceholder: React.FC<{
  size: TileSize
  numberOfTiles: number
  title?: string
  animated?: boolean
  onDarkBackground?: boolean
}> = ({ size, numberOfTiles, title, animated, onDarkBackground }) => {
  const data = new Array(numberOfTiles)
    .fill(null)
    .map((_, index: number) => ({ key: index.toString() }))

  const renderPlaceholder = useCallback(
    () => <OfferTilePlaceholder size={size} animated={animated} />,
    [size, animated]
  )

  return (
    <Container>
      <Spacer.Row numberOfSpaces={6} />
      <View>
        <Spacer.Column numberOfSpaces={1} />
        {title ? (
          <StyledTitleComponent onDarkBackground={onDarkBackground}>{title}</StyledTitleComponent>
        ) : (
          <ModuleTitlePlaceholder />
        )}
        <Spacer.Column numberOfSpaces={5} />
        <FlatList
          horizontal
          data={data}
          renderItem={renderPlaceholder}
          ItemSeparatorComponent={() => <Spacer.Row numberOfSpaces={4} />}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </Container>
  )
}

export const OfferModulePlaceholder = memo(UnmemoizedOfferModulePlaceholder)

const ModuleTitlePlaceholder = () => (
  <SkeletonTile width={getSpacing(50)} height={getSpacing(4)} borderRadius={2} />
)

const UnmemoizedOfferTilePlaceholder = ({
  size,
  animated,
}: {
  size: number
  animated?: boolean
}) => {
  const width = size * RATIO_HOME_IMAGE
  return (
    <View>
      <BasePlaceholder height={size} width={width} animated={animated} />
      <Spacer.Column numberOfSpaces={3} />
      <TextPlaceholder width={0.8 * width} animated={animated} />
      <Spacer.Column numberOfSpaces={2} />
      <TextPlaceholder width={0.3 * width} animated={animated} />
      <Spacer.Column numberOfSpaces={3} />
    </View>
  )
}

export const OfferTilePlaceholder = memo(UnmemoizedOfferTilePlaceholder)

const BasePlaceholder = ({
  height,
  width,
  animated,
}: {
  height: number
  width: number
  animated?: boolean
}) => (
  <SkeletonTile
    borderRadius={BorderRadiusEnum.BORDER_RADIUS}
    height={height}
    width={width}
    animated={animated}
  />
)

const TextPlaceholder = ({
  width,
  height,
  animated,
}: {
  width: number
  height?: number
  animated?: boolean
}) => (
  <SkeletonTile
    height={height ?? getSpacing(3)}
    width={width}
    borderRadius={2}
    animated={animated}
  />
)

const UnmemoizedBusinessModulePlaceholder = () => {
  const { appContentWidth } = useTheme()
  const width = appContentWidth - 2 * MARGIN_DP
  const height = PixelRatio.roundToNearestPixel(width * RATIO_BUSINESS)
  return (
    <SkeletonTile height={height} width={width} borderRadius={BorderRadiusEnum.BORDER_RADIUS} />
  )
}
export const BusinessModulePlaceholder = memo(UnmemoizedBusinessModulePlaceholder)

const Container = styled.View({ flexDirection: 'row', paddingBottom: getSpacing(6) })

const StyledTitleComponent = styled(Typo.Title3).attrs({
  numberOfLines: 2,
  ...getHeadingAttrs(2),
})<{ onDarkBackground?: boolean }>(({ onDarkBackground, theme }) => ({
  color: onDarkBackground ? theme.colors.white : theme.colors.black,
}))
