import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View, PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import { Layout } from 'features/home/contentful'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { logConsultOffer } from 'libs/analytics'
import { MARGIN_DP, LENGTH_M, LENGTH_L, RATIO_ALGOLIA } from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'

import { ImageCaption } from './ImageCaption'
import { OfferCaption } from './OfferCaption'

interface OfferTileProps {
  category: string
  distance?: string
  date?: string
  name?: string
  isDuo?: boolean
  offerId: number
  price: string
  thumbUrl?: string
  layout?: Layout
  isBeneficiary?: boolean
  moduleName: string
}

export const OfferTile = (props: OfferTileProps) => {
  const navigation = useNavigation<UseNavigationType>()
  const { layout = 'one-item-medium', moduleName, isBeneficiary, ...offer } = props
  const imageHeight = layout === 'two-items' ? LENGTH_M : LENGTH_L
  const imageWidth = imageHeight * RATIO_ALGOLIA

  function handlePressOffer() {
    navigation.navigate('Offer', { id: offer.offerId })
    logConsultOffer(offer.offerId, moduleName)
  }

  return (
    <Container>
      <TouchableHighlight imageHeight={imageHeight} onPress={handlePressOffer}>
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
        isBeneficiary={isBeneficiary}
        price={offer.price}
      />
    </Container>
  )
}

const rowHeight = PixelRatio.roundToNearestPixel(MARGIN_DP)

const Container = styled.View({ flex: 1 })

const TouchableHighlight = styled.TouchableHighlight<{ imageHeight: number }>(
  ({ imageHeight }) => ({
    borderRadius: BorderRadiusEnum.BORDER_RADIUS,
    height: imageHeight + rowHeight,
  })
)

const Image = styled.Image<{ imageWidth: number; imageHeight: number }>(
  ({ imageWidth, imageHeight }) => ({
    height: imageHeight,
    width: imageWidth,
    borderTopLeftRadius: BorderRadiusEnum.BORDER_RADIUS,
    borderTopRightRadius: BorderRadiusEnum.BORDER_RADIUS,
  })
)
