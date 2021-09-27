import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View, PixelRatio } from 'react-native'
import { useQueryClient } from 'react-query'
import styled from 'styled-components/native'

import {
  CategoryNameEnum,
  ExpenseDomain,
  OfferResponse,
  OfferStockResponse,
  SubcategoryIdEnum,
} from 'api/gen'
import { Layout } from 'features/home/contentful'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { accessibilityAndTestId } from 'tests/utils'
import { ImageCaption } from 'ui/components/ImageCaption'
import { ImageTile } from 'ui/components/ImageTile'
import { OfferCaption } from 'ui/components/OfferCaption'
import { MARGIN_DP, LENGTH_M, LENGTH_L, RATIO_HOME_IMAGE } from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'

interface OfferTileProps {
  category: string
  categoryName: CategoryNameEnum | null | undefined
  subcategoryId: SubcategoryIdEnum
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
  'category' | 'categoryName' | 'thumbUrl' | 'isDuo' | 'name' | 'offerId' | 'subcategoryId'
>

export const mergeOfferData = (offer: PartialOffer) => (
  prevData: OfferResponse | undefined
): OfferResponse => ({
  description: '',
  image: offer.thumbUrl ? { url: offer.thumbUrl } : undefined,
  isDuo: offer.isDuo || false,
  name: offer.name || '',
  isDigital: false,
  isExpired: false,
  isEducational: false,
  isReleased: false,
  isSoldOut: false,
  id: offer.offerId,
  stocks: [] as Array<OfferStockResponse>,
  expenseDomains: [] as Array<ExpenseDomain>,
  accessibility: {},
  category: {
    label: offer.category,
    name: offer.categoryName || undefined,
  } as OfferResponse['category'],
  subcategoryId: offer.subcategoryId,
  venue: { coordinates: {} } as OfferResponse['venue'],
  ...(prevData || {}),
})

export const OfferTile = (props: OfferTileProps) => {
  const navigation = useNavigation<UseNavigationType>()
  const { layout = 'one-item-medium', moduleName, isBeneficiary, ...offer } = props
  const imageHeight = layout === 'two-items' ? LENGTH_M : LENGTH_L
  const imageWidth = imageHeight * RATIO_HOME_IMAGE
  const queryClient = useQueryClient()

  function handlePressOffer() {
    // We pre-populate the query-cache with the data from the search result for a smooth transition
    queryClient.setQueryData(['offer', offer.offerId], mergeOfferData(offer))
    analytics.logConsultOffer({ offerId: offer.offerId, from: 'home', moduleName })
    navigation.navigate('Offer', {
      id: offer.offerId,
      from: 'home',
      moduleName,
    })
  }

  return (
    <Container>
      <TouchableHighlight
        imageHeight={imageHeight}
        onPress={handlePressOffer}
        {...accessibilityAndTestId('offerTile')}>
        <View>
          <ImageTile
            imageWidth={imageWidth}
            imageHeight={imageHeight}
            uri={offer.thumbUrl}
            onlyTopBorderRadius
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
