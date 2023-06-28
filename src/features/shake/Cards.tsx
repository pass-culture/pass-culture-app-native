import React, { FunctionComponent } from 'react'
import { PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import { ImageCaption } from 'ui/components/ImageCaption'
import { ImageTile } from 'ui/components/ImageTile'
import { getSpacing, MARGIN_DP } from 'ui/theme'

const OFFER_HEIGHT_1 = getSpacing(80)
const OFFER_WIDTH_1 = OFFER_HEIGHT_1 * 0.75

const OFFER_HEIGHT_2 = OFFER_HEIGHT_1 * 0.9
const OFFER_WIDTH_2 = OFFER_WIDTH_1 * 0.9

const OFFER_HEIGHT_3 = OFFER_HEIGHT_1 * 0.8
const OFFER_WIDTH_3 = OFFER_WIDTH_1 * 0.8

const IMAGE_CAPTION_HEIGHT = PixelRatio.roundToNearestPixel(MARGIN_DP)

const OFFER_POSITION_X_2 = 7.5
const OFFER_POSITION_X_3 = OFFER_POSITION_X_2 * 2

const OFFER_POSITION_Y_2 = 27.5
const OFFER_POSITION_Y_3 = OFFER_POSITION_Y_2 * 2

type Props = {
  cards: Card[]
}

type Card = {
  uri?: string
  distance?: string
  categoryLabel: string | null
}

export const Cards: FunctionComponent<Props> = ({ cards }) => {
  return (
    <Container>
      {!!cards[2] && (
        <Card strikeLineAngle={OFFER_POSITION_X_3} positionX={OFFER_POSITION_Y_3} positionY={30}>
          <ImageTile
            onlyTopBorderRadius
            width={OFFER_WIDTH_3}
            height={OFFER_HEIGHT_3}
            uri={cards[2].uri}
          />
          <ImageCaption
            height={IMAGE_CAPTION_HEIGHT}
            width={OFFER_WIDTH_3}
            categoryLabel={cards[2].categoryLabel}
            distance={cards[2].distance}
          />
        </Card>
      )}
      {!!cards[1] && (
        <Card strikeLineAngle={OFFER_POSITION_X_2} positionX={OFFER_POSITION_Y_2} positionY={15}>
          <ImageTile
            onlyTopBorderRadius
            width={OFFER_WIDTH_2}
            height={OFFER_HEIGHT_2}
            uri={cards[1].uri}
          />
          <ImageCaption
            height={IMAGE_CAPTION_HEIGHT}
            width={OFFER_WIDTH_2}
            categoryLabel={cards[1].categoryLabel}
            distance={cards[1].distance}
          />
        </Card>
      )}
      {!!cards[0] && (
        <Card strikeLineAngle={0} positionX={0} positionY={0}>
          <ImageTile
            onlyTopBorderRadius
            width={OFFER_WIDTH_1}
            height={OFFER_HEIGHT_1}
            uri={cards[0].uri}
          />
          <ImageCaption
            height={IMAGE_CAPTION_HEIGHT}
            width={OFFER_WIDTH_1}
            categoryLabel={cards[0].categoryLabel}
            distance={cards[0].distance}
          />
        </Card>
      )}
    </Container>
  )
}

const Container = styled.View({
  alignItems: 'center',
  height: OFFER_HEIGHT_1 + IMAGE_CAPTION_HEIGHT,
})

const Card = styled.View<{ strikeLineAngle: number; positionX: number; positionY: number }>(
  ({ strikeLineAngle, positionX, positionY }) => {
    return {
      position: 'absolute',
      transform: `rotate(${strikeLineAngle}deg) translateX(${positionX}px) translateY(${positionY}px)`,
    }
  }
)
