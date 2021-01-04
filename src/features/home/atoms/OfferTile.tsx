import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View, PixelRatio } from 'react-native'
import { useQueryClient } from 'react-query'
import styled from 'styled-components/native'

import { OfferResponse } from 'api/gen'
import { Layout } from 'features/home/contentful'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { OfferAdaptedResponse } from 'features/offer/api/useOffer'
import { analytics } from 'libs/analytics'
import { MARGIN_DP, LENGTH_M, LENGTH_L, RATIO_ALGOLIA } from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'

import { ImageCaption } from './ImageCaption'
import { OfferCaption } from './OfferCaption'

interface OfferTileProps {
  category: string
  description?: string
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

type PartialOffer = Pick<
  OfferTileProps,
  'category' | 'description' | 'thumbUrl' | 'isDuo' | 'name' | 'offerId'
>

export const mergeOfferData = (offer: PartialOffer) => (
  prevData: OfferAdaptedResponse | undefined
): OfferAdaptedResponse => ({
  fullAddress: null,
  description: offer.description,
  imageUrl: offer.thumbUrl,
  isDuo: offer.isDuo || false,
  name: offer.name || '',
  isDigital: false,
  id: offer.offerId,
  stocks: [],
  accessibility: {},
  category: { label: offer.category } as OfferResponse['category'],
  venue: { coordinates: {} } as OfferResponse['venue'],
  ...(prevData || {}),
})

export const OfferTile = (props: OfferTileProps) => {
  const navigation = useNavigation<UseNavigationType>()
  const { layout = 'one-item-medium', moduleName, isBeneficiary, ...offer } = props
  const imageHeight = layout === 'two-items' ? LENGTH_M : LENGTH_L
  const imageWidth = imageHeight * RATIO_ALGOLIA
  const queryClient = useQueryClient()

  function handlePressOffer() {
    // We pre-populate the query-cache with the data from algolia for a smooth transition
    queryClient.setQueryData(['offer', offer.offerId], mergeOfferData(offer))
    analytics.logConsultOffer(offer.offerId, moduleName)
    navigation.navigate('Offer', { id: offer.offerId })
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
