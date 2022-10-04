import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { SkeletonTile } from 'features/home/atoms/SkeletonTile'
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

export function NumberOfResultsPlaceholder() {
  return (
    <Container>
      <Spacer.Column numberOfSpaces={3} />
      <SkeletonTile width={getSpacing(20)} height={getSpacing(3)} borderRadius={2} />
      <Spacer.Column numberOfSpaces={5} />
    </Container>
  )
}

export function NumberOfBookingsPlaceholder() {
  return (
    <Container>
      <Spacer.Column numberOfSpaces={3} />
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
      <ButtonsRow>
        <ButtonContainer>
          <BasePlaceholder radius={24} height={getSpacing(12)} width={getSpacing(40)} fullWidth />
        </ButtonContainer>
        <ButtonSpacer />
        <ButtonContainer>
          <BasePlaceholder radius={24} height={getSpacing(12)} width={getSpacing(40)} fullWidth />
        </ButtonContainer>
      </ButtonsRow>
    </Container>
  )
}

const Container = styled.View({ marginHorizontal: getSpacing(6) })
const Row = styled.View({ flexDirection: 'row', alignItems: 'center' })
const ButtonContainer = styled.View({
  minWidth: getSpacing(30),
  maxWidth: getSpacing(70),
  width: '47%',
})
const ButtonsRow = styled.View(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: theme.isMobileViewport ? 'space-between' : 'center',
  marginTop: getSpacing(6),
}))
const ButtonSpacer = styled.View(({ theme }) => ({
  flex: theme.isMobileViewport ? 0 : 1 / 30,
}))
