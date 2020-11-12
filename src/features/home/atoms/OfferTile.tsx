import React from 'react'
import { PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import { Layout } from 'features/home/contentful'
import { AlgoliaHit } from 'libs/algolia'
import { _ } from 'libs/i18n'
import { BORDER_RADIUS, MARGIN_DP, LENGTH_M, LENGTH_L, RATIO_ALGOLIA } from 'ui/theme'

import { ImageCaption } from './ImageCaption'
import { OfferCaption } from './OfferCaption'

const formatPrice = (price?: number): string => {
  return price ? `${price} €`.replace('.', ',') : 'Gratuit'
}

interface OfferTileProps {
  tile: AlgoliaHit
  layout?: Layout
}

export const OfferTile = ({ tile: { offer }, layout = 'one-item-medium' }: OfferTileProps) => {
  const imageHeight = layout === 'two-items' ? LENGTH_M : LENGTH_L
  const imageWidth = PixelRatio.roundToNearestPixel(imageHeight * RATIO_ALGOLIA)

  const handlePressImage = (offerId?: string): void => {
    // eslint-disable-next-line no-console
    console.log(`Opening offer ${offerId}...`)
  }

  return (
    <Container>
      <TouchableHighlight imageHeight={imageHeight} onPress={() => handlePressImage(offer.id)}>
        <>
          <Image
            imageHeight={imageHeight}
            imageWidth={imageWidth}
            source={{ uri: offer.thumbUrl }}
            testID="offerTileImage"
          />
          <ImageCaption imageWidth={imageWidth} category={offer.category} distance={'1,2km'} />
        </>
      </TouchableHighlight>

      <OfferCaption
        imageWidth={imageWidth}
        name={offer.name}
        date={'Dès le 12 mars 2020'}
        isDuo={offer.isDuo}
        price={formatPrice(offer.priceMin)}
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
    flex: 1,
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
