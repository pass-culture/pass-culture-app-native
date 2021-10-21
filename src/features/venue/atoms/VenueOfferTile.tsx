import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { PixelRatio, View } from 'react-native'
import { useQueryClient } from 'react-query'
import styled from 'styled-components/native'

import { CategoryIdEnum, SubcategoryIdEnum } from 'api/gen'
import { mergeOfferData } from 'features/home/atoms/OfferTile'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { QueryKeys } from 'libs/queryKeys'
import { ImageCaption } from 'ui/components/ImageCaption'
import { ImageTile } from 'ui/components/ImageTile'
import { OfferCaption } from 'ui/components/OfferCaption'
import { LENGTH_L, RATIO_HOME_IMAGE } from 'ui/theme'
import { BorderRadiusEnum, MARGIN_DP } from 'ui/theme/grid'

interface VenueOfferTileProps {
  categoryId: CategoryIdEnum | null | undefined
  categoryLabel: string | null
  subcategoryId: SubcategoryIdEnum
  date?: string
  name?: string
  isDuo?: boolean
  offerId: number
  price: string
  thumbUrl?: string
  isBeneficiary?: boolean
  venueId?: number
}

/* TODO : When we add categories of offers at the top of the carousel
    - Remove <ImageCaption/>
    - Remove onlyTopBorderRadius
    - Remove rowHeight
  */

export const VenueOfferTile = (props: VenueOfferTileProps) => {
  const navigation = useNavigation<UseNavigationType>()
  const { isBeneficiary, venueId, categoryLabel, ...offer } = props
  const queryClient = useQueryClient()

  function handlePressOffer() {
    // We pre-populate the query-cache with the data from the search result for a smooth transition
    queryClient.setQueryData([QueryKeys.OFFER, offer.offerId], mergeOfferData(offer))
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
          <ImageCaption imageWidth={imageWidth} categoryLabel={categoryLabel} />
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
