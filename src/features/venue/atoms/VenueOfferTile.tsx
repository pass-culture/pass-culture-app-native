import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { PixelRatio, View } from 'react-native'
import { useQueryClient } from 'react-query'
import styled from 'styled-components/native'

import { CategoryNameEnum, ExpenseDomain, OfferResponse, OfferStockResponse } from 'api/gen'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { OfferAdaptedResponse } from 'features/offer/api/useOffer'
import { analytics } from 'libs/analytics'
import { ImageCaption } from 'ui/components/ImageCaption'
import { ImageTile } from 'ui/components/ImageTile'
import { OfferCaption } from 'ui/components/OfferCaption'
import { LENGTH_L, RATIO_HOME_IMAGE } from 'ui/theme'
import { BorderRadiusEnum, MARGIN_DP } from 'ui/theme/grid'

interface OfferTileProps {
  category: string
  categoryName: CategoryNameEnum | null | undefined
  description?: string | null
  date?: string
  name?: string
  isDuo?: boolean
  offerId: number
  price: string
  thumbUrl?: string
  isBeneficiary?: boolean
  venueId?: number
}

type PartialOffer = Pick<
  OfferTileProps,
  'category' | 'categoryName' | 'description' | 'thumbUrl' | 'isDuo' | 'name' | 'offerId'
>

export const mergeOfferData = (offer: PartialOffer) => (
  prevData: OfferAdaptedResponse | undefined
): OfferAdaptedResponse => ({
  fullAddress: null,
  description: offer.description,
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
  venue: { coordinates: {} } as OfferResponse['venue'],
  ...(prevData || {}),
})

/* TODO : When we add categories of offers at the top of the carousel
    - Remove <ImageCaption/>
    - Remove onlyTopBorderRadius
    - Remove rowHeight
  */

export const VenueOfferTile = (props: OfferTileProps) => {
  const navigation = useNavigation<UseNavigationType>()
  const { isBeneficiary, venueId, ...offer } = props
  const queryClient = useQueryClient()

  function handlePressOffer() {
    // We pre-populate the query-cache with the data from the search result for a smooth transition
    queryClient.setQueryData(['offer', offer.offerId], mergeOfferData(offer))
    analytics.logConsultOffer({ offerId: offer.offerId, from: 'venue', venueId })
    navigation.navigate('Offer', {
      id: offer.offerId,
      from: 'venue',
    })
  }

  return (
    <View>
      <TouchableHighlight imageHeight={imageHeight} onPress={handlePressOffer}>
        <View>
          <ImageTile
            imageWidth={imageWidth}
            imageHeight={imageHeight}
            uri={offer.thumbUrl}
            onlyTopBorderRadius
          />
          <ImageCaption imageWidth={imageWidth} category={offer.category} />
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
    </View>
  )
}

const imageHeight = LENGTH_L
const imageWidth = imageHeight * RATIO_HOME_IMAGE
const rowHeight = PixelRatio.roundToNearestPixel(MARGIN_DP)

const TouchableHighlight = styled.TouchableHighlight<{ imageHeight: number }>(
  ({ imageHeight }) => ({
    borderRadius: BorderRadiusEnum.BORDER_RADIUS,
    height: imageHeight + rowHeight,
  })
)
