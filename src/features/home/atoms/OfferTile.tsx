import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View, PixelRatio } from 'react-native'
import { useQueryClient } from 'react-query'
import styled from 'styled-components/native'

import {
  CategoryIdEnum,
  ExpenseDomain,
  OfferResponse,
  OfferStockResponse,
  OfferVenueResponse,
  SubcategoryIdEnum,
} from 'api/gen'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { QueryKeys } from 'libs/queryKeys'
import { accessibilityAndTestId } from 'tests/utils'
import { ImageCaption } from 'ui/components/ImageCaption'
import { ImageTile } from 'ui/components/ImageTile'
import { OfferCaption } from 'ui/components/OfferCaption'
import { MARGIN_DP } from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'

interface OfferTileProps {
  categoryId: CategoryIdEnum | null | undefined
  categoryLabel: string | null
  subcategoryId: SubcategoryIdEnum
  distance?: string
  date?: string
  name?: string
  isDuo?: boolean
  offerId: number
  price: string
  thumbUrl?: string
  isBeneficiary?: boolean
  moduleName: string
  width: number
  height: number
}

type PartialOffer = Pick<
  OfferTileProps,
  'categoryId' | 'thumbUrl' | 'isDuo' | 'name' | 'offerId' | 'subcategoryId'
>

// Here we do optimistic rendering: we suppose that if the offer is available
// as a search result, by the time the user clicks on it, the offer is still
// available, released, not sold out...
export const mergeOfferData = (offer: PartialOffer) => (
  prevData: OfferResponse | undefined
): OfferResponse => ({
  description: '',
  image: offer.thumbUrl ? { url: offer.thumbUrl } : undefined,
  isDuo: offer.isDuo || false,
  name: offer.name || '',
  isDigital: false,
  isExpired: false,
  // assumption. If wrong, we receive correct data once API call finishes.
  // In the meantime, we have to make sure no visual glitch appears.
  // For example, before displaying the CTA, we wait for the API call to finish.
  isEducational: false,
  isReleased: true,
  isSoldOut: false,
  id: offer.offerId,
  stocks: [] as Array<OfferStockResponse>,
  expenseDomains: [] as Array<ExpenseDomain>,
  accessibility: {},
  category: { label: '', name: undefined } as OfferResponse['category'],
  subcategoryId: offer.subcategoryId,
  venue: { coordinates: {} } as OfferVenueResponse,
  ...(prevData || {}),
})

export const OfferTile = (props: OfferTileProps) => {
  const navigation = useNavigation<UseNavigationType>()
  const { width, height, moduleName, isBeneficiary, categoryLabel, ...offer } = props
  const queryClient = useQueryClient()

  function handlePressOffer() {
    // We pre-populate the query-cache with the data from the search result for a smooth transition
    queryClient.setQueryData([QueryKeys.OFFER, offer.offerId], mergeOfferData(offer))
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
        imageHeight={height}
        onPress={handlePressOffer}
        {...accessibilityAndTestId('offerTile')}>
        <View>
          <ImageTile
            imageWidth={width}
            imageHeight={height}
            uri={offer.thumbUrl}
            onlyTopBorderRadius
          />
          <ImageCaption
            imageWidth={width}
            categoryLabel={categoryLabel}
            distance={offer.distance}
          />
        </View>
      </TouchableHighlight>

      <OfferCaption
        imageWidth={width}
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
