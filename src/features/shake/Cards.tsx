import React, { FunctionComponent } from 'react'
import { PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import { ImageCaption } from 'ui/components/ImageCaption'
import { ImageTile } from 'ui/components/ImageTile'
import { getSpacing, MARGIN_DP } from 'ui/theme'

const OFFER_HEIGHT_1 = getSpacing(70)
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
  uri: string
  distance: string
  categoryLabel: string
}

export const Cards: FunctionComponent<Props> = ({ uri, distance, categoryLabel }) => {
  return (
    <Container>
      <Card strikeLineAngle={OFFER_POSITION_X_3} positionX={OFFER_POSITION_Y_3} positionY={30}>
        <ImageTile onlyTopBorderRadius width={OFFER_WIDTH_3} height={OFFER_HEIGHT_3} uri={uri} />
        <ImageCaption
          height={IMAGE_CAPTION_HEIGHT}
          width={OFFER_WIDTH_3}
          categoryLabel={categoryLabel}
          distance={distance}
        />
      </Card>
      <Card strikeLineAngle={OFFER_POSITION_X_2} positionX={OFFER_POSITION_Y_2} positionY={15}>
        <ImageTile onlyTopBorderRadius width={OFFER_WIDTH_2} height={OFFER_HEIGHT_2} uri={uri} />
        <ImageCaption
          height={IMAGE_CAPTION_HEIGHT}
          width={OFFER_WIDTH_2}
          categoryLabel={categoryLabel}
          distance={distance}
        />
      </Card>
      <Card strikeLineAngle={0} positionX={0} positionY={0}>
        <ImageTile onlyTopBorderRadius width={OFFER_WIDTH_1} height={OFFER_HEIGHT_1} uri={uri} />
        <ImageCaption
          height={IMAGE_CAPTION_HEIGHT}
          width={OFFER_WIDTH_1}
          categoryLabel={categoryLabel}
          distance={distance}
        />
      </Card>
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
