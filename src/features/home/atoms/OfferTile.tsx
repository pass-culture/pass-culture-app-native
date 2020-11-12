import React from 'react'
import { View, PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import { Layout } from 'features/home/contentful'
import { BORDER_RADIUS, MARGIN_DP, LENGTH_M, LENGTH_L, RATIO_ALGOLIA } from 'ui/theme'

import { ImageCaption } from './ImageCaption'
import { OfferCaption } from './OfferCaption'

interface OfferTileProps {
  category: string
  distance?: string
  date?: string
  name?: string
  isDuo?: boolean
  offerId: string
  price: string
  thumbUrl?: string
  layout?: Layout
}

export const OfferTile = (props: OfferTileProps) => {
  const { layout = 'one-item-medium', ...offer } = props
  const imageHeight = layout === 'two-items' ? LENGTH_M : LENGTH_L
  const imageWidth = PixelRatio.roundToNearestPixel(imageHeight * RATIO_ALGOLIA)

  const handlePressImage = (offerId?: string): void => {
    // eslint-disable-next-line no-console
    console.log(`Opening offer ${offerId}...`)
  }

  return (
    <Container>
      <TouchableHighlight imageHeight={imageHeight} onPress={() => handlePressImage(offer.offerId)}>
        <View>
          <Image
            imageHeight={imageHeight}
            imageWidth={imageWidth}
            source={{ uri: offer.thumbUrl }}
            testID="offerTileImage"
          />
          <ImageCaption
            imageWidth={imageWidth}
            category={offer.category}
            distance={offer.distance}
          />
        </View>
      </TouchableHighlight>

      <OfferCaption
        imageWidth={imageWidth}
        name={offer.name}
        date={offer.date}
        isDuo={offer.isDuo}
        price={offer.price}
      />
    </Container>
  )
}

const rowHeight = PixelRatio.roundToNearestPixel(MARGIN_DP)

const Container = styled.View({
  flex: 1,
})

const TouchableHighlight = styled.TouchableHighlight<{ imageHeight: number }>(
  ({ imageHeight }) => ({
    borderRadius: BORDER_RADIUS,
    height: imageHeight + rowHeight,
  })
)

const Image = styled.Image<{ imageWidth: number; imageHeight: number }>(
  ({ imageWidth, imageHeight }) => ({
    height: imageHeight,
    width: imageWidth,
    borderTopLeftRadius: BORDER_RADIUS,
    borderTopRightRadius: BORDER_RADIUS,
  })
)
