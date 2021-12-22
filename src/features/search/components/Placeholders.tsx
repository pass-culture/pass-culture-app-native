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

function BasePlaceholder({ height, width }: { height: number; width: number }) {
  return <SkeletonTile borderRadius={borderRadius} height={height} width={width} />
}

function TextPlaceholder({ width, height }: { width: number; height?: number }) {
  return <SkeletonTile borderRadius={2} height={height ?? getSpacing(3)} width={width} />
}

export function NumberOfResultsPlaceholder() {
  return (
    <Container>
      <Spacer.Column numberOfSpaces={7} />
      <SkeletonTile width={getSpacing(20)} height={getSpacing(3)} borderRadius={2} />
      <Spacer.Column numberOfSpaces={5} />
    </Container>
  )
}

export function NumberOfBookingsPlaceholder() {
  return (
    <Container>
      <Spacer.Column numberOfSpaces={7} />
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

const Container = styled.View({ marginHorizontal: getSpacing(6) })
const Row = styled.View({ flexDirection: 'row', alignItems: 'center' })
