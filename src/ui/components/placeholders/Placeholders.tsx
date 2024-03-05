import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { FavoriteButtonsContainer } from 'features/favorites/components/Favorite'
import { theme } from 'theme'
import { SkeletonTile } from 'ui/components/placeholders/SkeletonTile'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { getSpacing, Spacer } from 'ui/theme'

const borderRadius = 4

const imageWidth = getSpacing(16)
const imageHeight = getSpacing(24) // ratio 2/3

const bookingImageWidth = getSpacing(18)
const bookingImageHeight = getSpacing(28)

function BasePlaceholder(props: {
  height: number
  width: number
  radius?: number
  fullWidth?: boolean
}) {
  return (
    <SkeletonTile
      borderRadius={props.radius ?? borderRadius}
      height={props.height}
      width={props.width}
      fullWidth={props.fullWidth}
    />
  )
}

function TextPlaceholder({ width, height }: { width: number; height?: number }) {
  return <SkeletonTile borderRadius={2} height={height ?? getSpacing(3)} width={width} />
}

export function OfferButtonPlaceholder() {
  return (
    <SkeletonTile
      borderRadius={theme.borderRadius.button}
      width={getSpacing(82)}
      height={getSpacing(10)}
      fullWidth
    />
  )
}

export function OfferImagePlaceholder() {
  return <TextPlaceholder height={getSpacing(95)} width={getSpacing(60)} />
}

export function OfferContentBodyPlaceholder() {
  return (
    <React.Fragment>
      <Container>
        <Row>
          <TextPlaceholder height={getSpacing(6)} width={getSpacing(22)} />
          <Spacer.Row numberOfSpaces={2} />
          <TextPlaceholder height={getSpacing(6)} width={getSpacing(22)} />
        </Row>
        <Spacer.Column numberOfSpaces={5} />
        <TextPlaceholder height={getSpacing(4)} width={getSpacing(74)} />
        <Spacer.Column numberOfSpaces={2} />
        <TextPlaceholder height={getSpacing(4)} width={getSpacing(40)} />
        <Spacer.Column numberOfSpaces={10} />
        <TextPlaceholder height={getSpacing(5)} width={getSpacing(22)} />
        <Spacer.Column numberOfSpaces={10} />
        <TextPlaceholder height={getSpacing(4)} width={getSpacing(33)} />
        <Spacer.Column numberOfSpaces={3.5} />
        <TextPlaceholder height={getSpacing(2)} width={getSpacing(82)} />
        <Spacer.Column numberOfSpaces={2} />
        <TextPlaceholder height={getSpacing(2)} width={getSpacing(67)} />
        <Spacer.Column numberOfSpaces={2} />
        <TextPlaceholder height={getSpacing(2)} width={getSpacing(82)} />
        <Spacer.Column numberOfSpaces={2} />
        <TextPlaceholder height={getSpacing(2)} width={getSpacing(67)} />
        <Spacer.Column numberOfSpaces={2} />
        <TextPlaceholder height={getSpacing(2)} width={getSpacing(82)} />
        <Spacer.Column numberOfSpaces={2} />
        <TextPlaceholder height={getSpacing(2)} width={getSpacing(82)} />
        <Spacer.Column numberOfSpaces={8} />
      </Container>
      <SectionWithDivider visible margin>
        <Spacer.Column numberOfSpaces={8} />
        <TextPlaceholder height={getSpacing(5)} width={getSpacing(63)} />
        <Spacer.Column numberOfSpaces={8} />
        <TextPlaceholder height={getSpacing(4)} width={getSpacing(33)} />
        <Spacer.Column numberOfSpaces={2} />
        <TextPlaceholder height={getSpacing(2)} width={getSpacing(58)} />
        <Spacer.Column numberOfSpaces={6} />
        <TextPlaceholder height={getSpacing(6)} width={getSpacing(16)} />
        <Spacer.Column numberOfSpaces={4} />
      </SectionWithDivider>
    </React.Fragment>
  )
}

export function NumberOfResultsPlaceholder() {
  return (
    <Container>
      <Spacer.Column numberOfSpaces={1} />
      <SkeletonTile width={getSpacing(20)} height={getSpacing(3)} borderRadius={2} />
      <Spacer.Column numberOfSpaces={5} />
    </Container>
  )
}

export function NumberOfBookingsPlaceholder() {
  return (
    <Container>
      <Spacer.Column numberOfSpaces={1} />
      <SkeletonTile width={getSpacing(42)} height={getSpacing(3)} borderRadius={2} />
      <Spacer.Column numberOfSpaces={5} />
    </Container>
  )
}

export function HitPlaceholder() {
  return (
    <Container>
      <Row>
        <BasePlaceholder height={imageHeight} width={imageWidth} />
        <Spacer.Row numberOfSpaces={4} />
        <View>
          <TextPlaceholder width={getSpacing(60)} />
          <Spacer.Column numberOfSpaces={3} />
          <TextPlaceholder width={getSpacing(30)} />
          <Spacer.Column numberOfSpaces={1} />
          <TextPlaceholder width={getSpacing(40)} />
          <Spacer.Column numberOfSpaces={2} />
          <TextPlaceholder width={getSpacing(8)} />
        </View>
      </Row>
    </Container>
  )
}

export function BookingHitPlaceholder() {
  return (
    <Container>
      <Row>
        <BasePlaceholder height={bookingImageHeight} width={bookingImageWidth} />
        <Spacer.Row numberOfSpaces={4} />
        <View>
          <TextPlaceholder width={getSpacing(60)} />
          <Spacer.Column numberOfSpaces={1} />
          <TextPlaceholder width={getSpacing(30)} />
          <Spacer.Column numberOfSpaces={7} />
          <TextPlaceholder width={getSpacing(24)} />
          <Spacer.Column numberOfSpaces={3} />
          <TextPlaceholder width={getSpacing(8)} />
          <Spacer.Column numberOfSpaces={2} />
        </View>
      </Row>
    </Container>
  )
}

export function FavoriteHitPlaceholder() {
  return (
    <React.Fragment>
      <Container>
        <Row>
          <BasePlaceholder height={imageHeight} width={imageWidth} />
          <Spacer.Row numberOfSpaces={4} />
          <View>
            <TextPlaceholder width={getSpacing(60)} />
            <Spacer.Column numberOfSpaces={3} />
            <TextPlaceholder width={getSpacing(30)} />
            <Spacer.Column numberOfSpaces={1} />
            <TextPlaceholder width={getSpacing(40)} />
            <Spacer.Column numberOfSpaces={2} />
            <TextPlaceholder width={getSpacing(8)} />
          </View>
        </Row>
      </Container>
      <FavoriteButtonsContainer>
        <ButtonContainer>
          <BasePlaceholder radius={24} height={getSpacing(12)} width={getSpacing(40)} fullWidth />
        </ButtonContainer>
        <Spacer.Row numberOfSpaces={5} />
        <ButtonContainer>
          <BasePlaceholder radius={24} height={getSpacing(12)} width={getSpacing(40)} fullWidth />
        </ButtonContainer>
      </FavoriteButtonsContainer>
    </React.Fragment>
  )
}

const Container = styled.View({ marginHorizontal: getSpacing(6) })
const Row = styled.View({ flexDirection: 'row', alignItems: 'center' })
const ButtonContainer = styled.View({
  minWidth: getSpacing(30),
  maxWidth: getSpacing(70),
  width: '47%',
})
