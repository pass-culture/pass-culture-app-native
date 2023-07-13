import React, { FunctionComponent } from 'react'
import { PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import { OfferResponse } from 'api/gen'
import { useGeolocation } from 'libs/geolocation'
import { formatDistance } from 'libs/parsers'
import { useCategoryHomeLabelMapping } from 'libs/subcategories'
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
  cards: OfferResponse[]
}

export const Cards: FunctionComponent<Props> = ({ cards }) => {
  const labelMapping = useCategoryHomeLabelMapping()
  const { userPosition: position } = useGeolocation()
  return (
    <Container>
      {!!cards[2] && (
        <Card strikeLineAngle={OFFER_POSITION_X_3} positionX={OFFER_POSITION_Y_3} positionY={30}>
          <ImageTile
            onlyTopBorderRadius
            width={OFFER_WIDTH_3}
            height={OFFER_HEIGHT_3}
            uri={cards[2].image?.url}
          />
          <ImageCaption
            height={IMAGE_CAPTION_HEIGHT}
            width={OFFER_WIDTH_3}
            categoryLabel={labelMapping[cards[2].subcategoryId]}
            distance={formatDistance(
              {
                lat: cards[2].venue.coordinates.latitude,
                lng: cards[2].venue.coordinates.longitude,
              },
              position
            )}
          />
        </Card>
      )}
      {!!cards[1] && (
        <Card strikeLineAngle={OFFER_POSITION_X_2} positionX={OFFER_POSITION_Y_2} positionY={15}>
          <ImageTile
            onlyTopBorderRadius
            width={OFFER_WIDTH_2}
            height={OFFER_HEIGHT_2}
            uri={cards[1].image?.url}
          />
          <ImageCaption
            height={IMAGE_CAPTION_HEIGHT}
            width={OFFER_WIDTH_2}
            categoryLabel={labelMapping[cards[1].subcategoryId]}
            distance={formatDistance(
              {
                lat: cards[1].venue.coordinates.latitude,
                lng: cards[1].venue.coordinates.longitude,
              },
              position
            )}
          />
        </Card>
      )}
      {!!cards[0] && (
        <Card strikeLineAngle={0} positionX={0} positionY={0}>
          <ImageTile
            onlyTopBorderRadius
            width={OFFER_WIDTH_1}
            height={OFFER_HEIGHT_1}
            uri={cards[0].image?.url}
          />
          <ImageCaption
            height={IMAGE_CAPTION_HEIGHT}
            width={OFFER_WIDTH_1}
            categoryLabel={labelMapping[cards[0].subcategoryId]}
            distance={formatDistance(
              {
                lat: cards[0].venue.coordinates.latitude,
                lng: cards[0].venue.coordinates.longitude,
              },
              position
            )}
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
