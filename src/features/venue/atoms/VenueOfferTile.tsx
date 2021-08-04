import { useNavigation } from '@react-navigation/native'
import React, { useMemo } from 'react'
import FastImage from 'react-native-fast-image'
import { useQueryClient } from 'react-query'
import styled from 'styled-components/native'

import { CategoryNameEnum, ExpenseDomain, OfferResponse, OfferStockResponse } from 'api/gen'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { OfferAdaptedResponse } from 'features/offer/api/useOffer'
import { OfferCaption } from 'ui/components/OfferCaption'
import { LENGTH_L, RATIO_HOME_IMAGE } from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'

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
  moduleName: string
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

// TODO : Add ImageTile to ui components ?
const ImageTile = (props: { imageWidth: number; imageHeight: number; uri?: string }) => {
  const style = useMemo(
    () => ({
      height: props.imageHeight,
      width: props.imageWidth,
      borderRadius: BorderRadiusEnum.BORDER_RADIUS,
    }),
    [props.imageHeight, props.imageWidth]
  )

  const source = useMemo(() => ({ uri: props.uri }), [props.uri])

  return props.uri ? <FastImage style={style} source={source} testID="offerTileImage" /> : null
}

export const VenueOfferTile = (props: OfferTileProps) => {
  const navigation = useNavigation<UseNavigationType>()
  const { moduleName, isBeneficiary, ...offer } = props
  const queryClient = useQueryClient()

  function handlePressOffer() {
    // We pre-populate the query-cache with the data from the search result for a smooth transition
    queryClient.setQueryData(['offer', offer.offerId], mergeOfferData(offer))
    navigation.navigate('Offer', {
      id: offer.offerId,
      from: 'home',
      moduleName,
    })
  }

  return (
    <Container>
      <TouchableHighlight imageHeight={imageHeight} onPress={handlePressOffer}>
        <ImageTile imageWidth={imageWidth} imageHeight={imageHeight} uri={offer.thumbUrl} />
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

const imageHeight = LENGTH_L
const imageWidth = imageHeight * RATIO_HOME_IMAGE

const Container = styled.View({ flex: 1 })

const TouchableHighlight = styled.TouchableHighlight<{ imageHeight: number }>(
  ({ imageHeight }) => ({
    borderRadius: BorderRadiusEnum.BORDER_RADIUS,
    height: imageHeight,
  })
)
