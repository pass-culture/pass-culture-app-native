import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { FavoriteButtonsContainer } from 'features/favorites/components/Favorite'
import { SkeletonTile } from 'ui/components/placeholders/SkeletonTile'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing } from 'ui/theme'

const borderRadius = 4

const imageWidth = getSpacing(16)
const imageHeight = getSpacing(24) // ratio 2/3

const bookingImageWidth = getSpacing(18)
const bookingImageHeight = getSpacing(28)

const BasePlaceholder = (props: {
  height: number
  width: number
  radius?: number
  fullWidth?: boolean
}) => (
  <SkeletonTile
    borderRadius={props.radius ?? borderRadius}
    height={props.height}
    width={props.width}
    fullWidth={props.fullWidth}
  />
)

export const TextPlaceholder = ({
  width,
  height,
  marginBottom,
}: {
  width: number
  height?: number
  marginBottom?: number
}) => (
  <TextPlaceholderContainer marginBottom={marginBottom ?? undefined}>
    <SkeletonTile borderRadius={2} height={height ?? getSpacing(3)} width={width} />
  </TextPlaceholderContainer>
)

const FilterPillsPlaceholder = () => {
  const pillsWidth = [8, 17.5, 28, 30.5, 14.5, 19.5]
  return (
    <PillsContainer gap={1}>
      {pillsWidth.map((width) => (
        <SkeletonTile
          borderRadius={24}
          height={getSpacing(8)}
          width={getSpacing(width)}
          key={`pill-${width}`}
        />
      ))}
    </PillsContainer>
  )
}

export const HeaderSearchResultsPlaceholder = () => (
  <React.Fragment>
    <FilterPillsPlaceholder />
    <TitleContainer>
      <TextPlaceholder height={getSpacing(4.5)} width={getSpacing(50)} />
    </TitleContainer>
    <NumberOfResultsPlaceholder />
  </React.Fragment>
)

export const NumberOfResultsPlaceholder = () => (
  <Container>
    <SkeletonTile width={getSpacing(20)} height={getSpacing(3)} borderRadius={2} />
  </Container>
)

export const NumberOfBookingsPlaceholder = () => (
  <Container>
    <SkeletonTile width={getSpacing(42)} height={getSpacing(3)} borderRadius={2} />
  </Container>
)

export const HitPlaceholder = () => (
  <Row gap={4}>
    <BasePlaceholder height={imageHeight} width={imageWidth} />
    <View>
      <TextPlaceholder width={getSpacing(60)} marginBottom={3} />
      <TextPlaceholder width={getSpacing(30)} marginBottom={1} />
      <TextPlaceholder width={getSpacing(40)} marginBottom={2} />
      <TextPlaceholder width={getSpacing(8)} />
    </View>
  </Row>
)

export const BookingHitPlaceholder = () => (
  <Row gap={4}>
    <BasePlaceholder height={bookingImageHeight} width={bookingImageWidth} />
    <View>
      <TextPlaceholder width={getSpacing(60)} marginBottom={1} />
      <TextPlaceholder width={getSpacing(30)} marginBottom={7} />
      <TextPlaceholder width={getSpacing(24)} marginBottom={3} />
      <TextPlaceholder width={getSpacing(8)} marginBottom={2} />
    </View>
  </Row>
)

export const FavoriteHitPlaceholder = () => (
  <React.Fragment>
    <Row gap={4}>
      <BasePlaceholder height={imageHeight} width={imageWidth} />
      <View>
        <TextPlaceholder width={getSpacing(60)} marginBottom={3} />
        <TextPlaceholder width={getSpacing(30)} marginBottom={1} />
        <TextPlaceholder width={getSpacing(40)} marginBottom={2} />
        <TextPlaceholder width={getSpacing(8)} />
      </View>
    </Row>
    <FavoriteButtonsContainer gap={0}>
      <FirstButtonContainer>
        <BasePlaceholder radius={24} height={getSpacing(12)} width={getSpacing(40)} fullWidth />
      </FirstButtonContainer>
      <ButtonContainer>
        <BasePlaceholder radius={24} height={getSpacing(12)} width={getSpacing(40)} fullWidth />
      </ButtonContainer>
    </FavoriteButtonsContainer>
  </React.Fragment>
)

const Container = styled.View({
  marginHorizontal: getSpacing(6),
  marginTop: getSpacing(1),
  marginBottom: getSpacing(5),
})

const Row = styled(ViewGap)({
  flexDirection: 'row',
  alignItems: 'center',
  marginHorizontal: getSpacing(6),
})

const ButtonContainer = styled.View({
  minWidth: getSpacing(30),
  maxWidth: getSpacing(70),
  width: '47%',
})
const FirstButtonContainer = styled(ButtonContainer)({
  marginRight: getSpacing(5),
})

const TextPlaceholderContainer = styled.View<{ marginBottom: number }>(({ marginBottom }) => ({
  marginBottom: getSpacing(marginBottom),
}))

const PillsContainer = styled(ViewGap)({
  flexDirection: 'row',
  marginHorizontal: getSpacing(6),
  marginVertical: getSpacing(1),
})

const TitleContainer = styled.View({
  marginHorizontal: getSpacing(6),
  marginTop: getSpacing(6),
  marginBottom: getSpacing(2),
})
