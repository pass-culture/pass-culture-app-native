import React, { useCallback } from 'react'
import { View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import styled from 'styled-components/native'

import { SkeletonTile } from 'ui/components/placeholders/SkeletonTile'
import { getSpacing, LENGTH_L, LENGTH_M, RATIO_HOME_IMAGE, Spacer } from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'

enum TileSize {
  M = LENGTH_M,
  L = LENGTH_L,
}

export const OfferPlaylistSkeleton: React.FC<{ size: TileSize; numberOfTiles: number }> = ({
  size,
  numberOfTiles,
}) => {
  const data = new Array(numberOfTiles)
    .fill(null)
    .map((_, index: number) => ({ key: index.toString() }))

  const renderPlaceholder = useCallback(() => <OfferTilePlaceholder size={size} />, [size])

  return (
    <Container>
      <Spacer.Row numberOfSpaces={6} />
      <View>
        <Spacer.Column numberOfSpaces={1} />
        <ModuleTitlePlaceholder />
        <Spacer.Column numberOfSpaces={5} />
        <FlatList
          horizontal
          data={data}
          renderItem={renderPlaceholder}
          ItemSeparatorComponent={Separator}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </Container>
  )
}

const ModuleTitlePlaceholder = () => (
  <SkeletonTile width={getSpacing(50)} height={getSpacing(4)} borderRadius={2} />
)

const OfferTilePlaceholder = ({ size }: { size: number }) => {
  const width = size * RATIO_HOME_IMAGE
  return (
    <View>
      <BasePlaceholder height={size} width={width} />
      <Spacer.Column numberOfSpaces={3} />
      <TextPlaceholder width={0.8 * width} />
      <Spacer.Column numberOfSpaces={2} />
      <TextPlaceholder width={0.3 * width} />
      <Spacer.Column numberOfSpaces={3} />
    </View>
  )
}

const BasePlaceholder = ({ height, width }: { height: number; width: number }) => (
  <SkeletonTile borderRadius={BorderRadiusEnum.BORDER_RADIUS} height={height} width={width} />
)

const TextPlaceholder = ({ width, height }: { width: number; height?: number }) => (
  <SkeletonTile height={height ?? getSpacing(3)} width={width} borderRadius={2} />
)

const Container = styled.View({ flexDirection: 'row', paddingBottom: getSpacing(6) })

const Separator = () => <Spacer.Row numberOfSpaces={4} />
