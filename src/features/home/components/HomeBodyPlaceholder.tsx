import React, { useCallback } from 'react'
import { View, Dimensions, PixelRatio } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import styled from 'styled-components/native'

import { SkeletonTile } from 'features/home/atoms/SkeletonTile'
import {
  getSpacing,
  LENGTH_L,
  LENGTH_M,
  MARGIN_DP,
  RATIO_HOME_IMAGE,
  RATIO_BUSINESS,
  Spacer,
} from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'

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
    <CenterContainer testID="HomeBodyPlaceholder-testID">
      <BusinessModulePlaceholder />
    </CenterContainer>
    <Spacer.Column numberOfSpaces={6} />
    <OfferModulePlaceholder size={LENGTH_M} numberOfTiles={5} />
    <Spacer.Column numberOfSpaces={6} />
    <OfferModulePlaceholder size={LENGTH_L} numberOfTiles={4} />
  </View>
)

const OfferModulePlaceholder: React.FC<{ size: TileSize; numberOfTiles: number }> = ({
  size,
  numberOfTiles,
}) => {
  const data = new Array(numberOfTiles)
    .fill(null)
    .map((_, index: number) => ({ key: index.toString() }))

  const renderPlaceholder = useCallback(() => {
    return <OfferTilePlaceholder size={size} />
  }, [size])

  return (
    <Row>
      <Spacer.Row numberOfSpaces={6} />
      <View>
        <ModuleTitlePlaceholder />
        <Spacer.Column numberOfSpaces={4} />
        <Row>
          <FlatList
            horizontal
            data={data}
            renderItem={renderPlaceholder}
            ItemSeparatorComponent={() => <Spacer.Row numberOfSpaces={4} />}
            showsHorizontalScrollIndicator={false}
          />
        </Row>
      </View>
    </Row>
  )
}

const ModuleTitlePlaceholder = () => (
  <SkeletonTile width={getSpacing(40)} height={getSpacing(4)} borderRadius={2} />
)

const OfferTilePlaceholder = ({ size }: { size: TileSize }) => {
  const height = size + PixelRatio.roundToNearestPixel(MARGIN_DP)
  const width = size * RATIO_HOME_IMAGE
  return (
    <View>
      <BasePlaceholder height={height} width={width} />
      <Spacer.Column numberOfSpaces={2} />
      <TextPlaceholder width={0.8 * width} />
      <Spacer.Column numberOfSpaces={2} />
      <TextPlaceholder width={0.3 * width} />
      <Spacer.Column numberOfSpaces={2} />
    </View>
  )
}

const BasePlaceholder = ({ height, width }: { height: number; width: number }) => (
  <SkeletonTile borderRadius={BorderRadiusEnum.BORDER_RADIUS} height={height} width={width} />
)

const TextPlaceholder = ({ width, height }: { width: number; height?: number }) => (
  <SkeletonTile height={height ?? getSpacing(3)} width={width} borderRadius={2} />
)

// eslint-disable-next-line no-restricted-properties
const businessWidth = Dimensions.get('window').width - 2 * MARGIN_DP
const businessHeight = PixelRatio.roundToNearestPixel(businessWidth * RATIO_BUSINESS)
const BusinessModulePlaceholder = () => (
  <SkeletonTile
    height={businessHeight}
    width={businessWidth}
    borderRadius={BorderRadiusEnum.BORDER_RADIUS}
  />
)

const Row = styled.View({ flexDirection: 'row' })

const CenterContainer = styled.View({
  flex: 1,
  alignItems: 'center',
})
