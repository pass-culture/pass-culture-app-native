import React, { useCallback } from 'react'
import { FlatList, StyleProp, View, ViewStyle } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { SkeletonTile } from 'ui/components/placeholders/SkeletonTile'
import { getSpacing, LENGTH_L, LENGTH_M, RATIO_HOME_IMAGE } from 'ui/theme'

export enum TileSize {
  MEDIUM = 'Medium',
  LARGE = 'Large',
}

const mapTileSizeToDimensions = (size: TileSize): number => {
  switch (size) {
    case TileSize.MEDIUM:
      return LENGTH_M
    case TileSize.LARGE:
      return LENGTH_L
  }
}

export const OfferPlaylistSkeleton: React.FC<{
  size: TileSize
  numberOfTiles: number
  style?: StyleProp<ViewStyle>
}> = ({ size, numberOfTiles, style }) => {
  const data = new Array(numberOfTiles)
    .fill(null)
    .map((_, index: number) => ({ key: index.toString() }))

  const renderPlaceholder = useCallback(
    () => <OfferTilePlaceholder size={mapTileSizeToDimensions(size)} />,
    [size]
  )

  return (
    <Container testID="OfferPlaylistSkeleton" style={style}>
      <ModuleTitlePlaceholder />
      <FlatList
        horizontal
        data={data}
        renderItem={renderPlaceholder}
        ItemSeparatorComponent={Separator}
        showsHorizontalScrollIndicator={false}
      />
    </Container>
  )
}

export const ModuleTitlePlaceholder = () => {
  const { designSystem } = useTheme()
  return (
    <SkeletonTile
      width={getSpacing(50)}
      height={getSpacing(4)}
      borderRadius={designSystem.size.borderRadius.m}
    />
  )
}

const OfferTilePlaceholder = ({ size }: { size: number }) => {
  const width = size * RATIO_HOME_IMAGE
  return (
    <View>
      <BasePlaceholder height={size} width={width} />
      <StyledView>
        <TextPlaceholder width={0.8 * width} />
        <TextPlaceholder width={0.3 * width} />
      </StyledView>
    </View>
  )
}

const BasePlaceholder = ({ height, width }: { height: number; width: number }) => {
  const { designSystem } = useTheme()
  return (
    <SkeletonTile borderRadius={designSystem.size.borderRadius.m} height={height} width={width} />
  )
}

export const TextPlaceholder = ({ width, height }: { width: number; height?: number }) => {
  const { designSystem } = useTheme()
  return (
    <SkeletonTile
      height={height ?? getSpacing(3)}
      width={width}
      borderRadius={designSystem.size.borderRadius.m}
    />
  )
}

const Container = styled.View({
  flexDirection: 'column',
  paddingHorizontal: getSpacing(6),
  gap: getSpacing(5),
  marginTop: getSpacing(1),
})

const Separator = () => <StyledSeparator />

const StyledView = styled.View(({ theme }) => ({
  gap: theme.designSystem.size.spacing.s,
  marginVertical: getSpacing(3),
}))

const StyledSeparator = styled.View({ width: getSpacing(4) })
