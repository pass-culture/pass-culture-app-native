import React from 'react'
import { PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import { ImageCaption } from 'ui/components/ImageCaption'
import { ImageTile } from 'ui/components/ImageTile'
import { getSpacing, MARGIN_DP } from 'ui/theme'

const OFFER_HEIGHT_1 = getSpacing(56)
const OFFER_WIDTH_1 = getSpacing(40)

const OFFER_HEIGHT_2 = OFFER_HEIGHT_1 * 0.9
const OFFER_WIDTH_2 = OFFER_WIDTH_1 * 0.9

const OFFER_HEIGHT_3 = OFFER_HEIGHT_1 * 0.8
const OFFER_WIDTH_3 = OFFER_WIDTH_1 * 0.8

const IMAGE_CAPTION_HEIGHT = PixelRatio.roundToNearestPixel(MARGIN_DP)

export const Cards = () => {
  return (
    <Container>
      <Card strikeLineAngle={15} positionX={43} positionY={32}>
        <ImageTile
          onlyTopBorderRadius
          width={OFFER_WIDTH_3}
          height={OFFER_HEIGHT_3}
          uri="https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/thumbs/mediations/test_image_2.png"
        />
        <ImageCaption
          height={IMAGE_CAPTION_HEIGHT}
          width={OFFER_WIDTH_3}
          categoryLabel="Théâtre"
          distance="100km"
        />
      </Card>
      <Card strikeLineAngle={7.5} positionX={22} positionY={15}>
        <ImageTile
          onlyTopBorderRadius
          width={OFFER_WIDTH_2}
          height={OFFER_HEIGHT_2}
          uri="https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/thumbs/mediations/test_image_1_bis.jpg"
        />
        <ImageCaption
          height={IMAGE_CAPTION_HEIGHT}
          width={OFFER_WIDTH_2}
          categoryLabel="Théâtre"
          distance="100km"
        />
      </Card>
      <Card strikeLineAngle={0} positionX={0} positionY={0}>
        <ImageTile
          onlyTopBorderRadius
          width={OFFER_WIDTH_1}
          height={OFFER_HEIGHT_1}
          uri="https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/thumbs/mediations/test_image_2.png"
        />
        <ImageCaption
          height={IMAGE_CAPTION_HEIGHT}
          width={OFFER_WIDTH_1}
          categoryLabel="Théâtre"
          distance="100km"
        />
      </Card>
    </Container>
  )
}

const Container = styled.View({
  padding: getSpacing(5),
  alignItems: 'center',
})

const Card = styled.View<{ strikeLineAngle: number; positionX: number; positionY: number }>(
  ({ strikeLineAngle, positionX, positionY }) => {
    return {
      position: 'absolute',
      transform: `rotate(${strikeLineAngle}deg) translateX(${positionX}px) translateY(${positionY}px)`,
    }
  }
)
