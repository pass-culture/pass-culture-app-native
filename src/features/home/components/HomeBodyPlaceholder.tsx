import React from 'react'
import ContentLoader from 'react-content-loader/native'
import { View, Dimensions, PixelRatio } from 'react-native'
import { G, Rect } from 'react-native-svg'
import styled from 'styled-components/native'

import {
  BORDER_RADIUS,
  ColorsEnum,
  getSpacing,
  LENGTH_L,
  LENGTH_M,
  MARGIN_DP,
  RATIO_ALGOLIA,
  RATIO_BUSINESS,
  Spacer,
} from 'ui/theme'

enum TileSize {
  M = LENGTH_M,
  L = LENGTH_L,
}

export const HomeBodyPlaceholder = () => (
  <React.Fragment>
    <OfferModulePlaceholder size={LENGTH_L} numberOfTiles={3} />
    <Spacer.Column numberOfSpaces={6} />
    <OfferModulePlaceholder size={LENGTH_M} numberOfTiles={4} />
    <Spacer.Column numberOfSpaces={6} />
    <CenterContainer testID="HomeBodyPlaceholder-testID">
      <BusinessModulePlaceholder />
    </CenterContainer>
    <Spacer.Column numberOfSpaces={6} />
    <OfferModulePlaceholder size={LENGTH_M} numberOfTiles={4} />
    <Spacer.Column numberOfSpaces={6} />
    <OfferModulePlaceholder size={LENGTH_L} numberOfTiles={3} />
  </React.Fragment>
)
const OfferModulePlaceholder: React.FC<{ size: TileSize; numberOfTiles: number }> = ({
  size,
  numberOfTiles,
}) => {
  return (
    <Row>
      <Spacer.Row numberOfSpaces={6} />
      <View>
        <ModuleTitlePlaceholder />
        <Spacer.Column numberOfSpaces={4} />
        <Row>
          {new Array(numberOfTiles).fill(null).map((_, index) => (
            <React.Fragment key={`placeholder-${index}`}>
              <OfferTilePlaceholder size={size} />
              <Spacer.Row numberOfSpaces={4} />
            </React.Fragment>
          ))}
        </Row>
      </View>
    </Row>
  )
}

const ModuleTitlePlaceholder = () => (
  <ContentLoader
    height={getSpacing(4)}
    width={getSpacing(40)}
    speed={1}
    backgroundColor={ColorsEnum.GREY_MEDIUM}
    foregroundColor={ColorsEnum.WHITE}>
    <Rect rx={2} ry={2} width={getSpacing(40)} height={getSpacing(4)} />
  </ContentLoader>
)

const OfferTilePlaceholder = ({ size }: { size: TileSize }) => {
  const height = size + PixelRatio.roundToNearestPixel(MARGIN_DP)
  const width = size * RATIO_ALGOLIA
  return (
    <ContentLoader
      height={height + getSpacing(10)}
      width={width}
      speed={1}
      backgroundColor={ColorsEnum.GREY_MEDIUM}
      foregroundColor={ColorsEnum.WHITE}>
      <G>
        <BasePlaceholder height={height} width={width} />
      </G>
      <G y={height + getSpacing(2)}>
        <TextPlaceholder width={0.8 * width} />
      </G>
      <G y={height + getSpacing(7)}>
        <TextPlaceholder width={0.3 * width} />
      </G>
    </ContentLoader>
  )
}

const BasePlaceholder = ({ height, width }: { height: number; width: number }) => (
  <Rect rx={BORDER_RADIUS} ry={BORDER_RADIUS} height={height} width={width} />
)
const TextPlaceholder = ({ width, height }: { width: number; height?: number }) => (
  <Rect rx={2} ry={2} height={height ?? getSpacing(3)} width={width} />
)

const BusinessModulePlaceholder = () => {
  const width = Dimensions.get('window').width - 2 * MARGIN_DP
  const height = PixelRatio.roundToNearestPixel(width * RATIO_BUSINESS)
  return (
    <ContentLoader
      height={height}
      width={width}
      speed={1}
      backgroundColor={ColorsEnum.GREY_MEDIUM}
      foregroundColor={ColorsEnum.WHITE}>
      <Rect rx={BORDER_RADIUS} ry={BORDER_RADIUS} width={width} height={height} />
    </ContentLoader>
  )
}

const Row = styled.View({
  flexDirection: 'row',
})

const CenterContainer = styled.View({
  flex: 1,
  alignItems: 'center',
})
