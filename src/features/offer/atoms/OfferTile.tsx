import React, { memo, useState } from 'react'
import { PixelRatio, View } from 'react-native'
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
import { Referrals } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/firebase/analytics'
import { QueryKeys } from 'libs/queryKeys'
import { tileAccessibilityLabel, TileContentType } from 'libs/tileAccessibilityLabel'
import { ImageCaption } from 'ui/components/ImageCaption'
import { ImageTile } from 'ui/components/ImageTile'
import { OfferCaption } from 'ui/components/OfferCaption'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { getSpacing, MARGIN_DP } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export interface OfferTileProps {
  categoryId: CategoryIdEnum | null | undefined
  categoryLabel: string | null
  subcategoryId: SubcategoryIdEnum
  distance?: string
  date?: string
  name?: string
  isDuo?: boolean
  offerId: number
  venueId?: number
  price: string
  thumbUrl?: string
  isBeneficiary?: boolean
  analyticsFrom: Referrals
  moduleName?: string
  moduleId?: string
  homeEntryId?: string
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
export const mergeOfferData =
  (offer: PartialOffer) =>
  (prevData: OfferResponse | undefined): OfferResponse => ({
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
    isForbiddenToUnderage: false,
    id: offer.offerId,
    stocks: [] as Array<OfferStockResponse>,
    expenseDomains: [] as Array<ExpenseDomain>,
    accessibility: {},
    subcategoryId: offer.subcategoryId,
    venue: { coordinates: {} } as OfferVenueResponse,
    ...(prevData || {}),
  })

const UnmemoizedOfferTile = (props: OfferTileProps) => {
  const {
    analyticsFrom,
    width,
    height,
    moduleName,
    moduleId,
    isBeneficiary,
    categoryLabel,
    venueId,
    homeEntryId,
    ...offer
  } = props

  const [isFocus, setIsFocus] = useState(false)
  const queryClient = useQueryClient()
  const { offerId, name, distance, date, price, isDuo } = offer
  const accessibilityLabel = tileAccessibilityLabel(TileContentType.OFFER, {
    ...offer,
    categoryLabel,
  })

  function handlePressOffer() {
    // We pre-populate the query-cache with the data from the search result for a smooth transition
    queryClient.setQueryData([QueryKeys.OFFER, offerId], mergeOfferData(offer))
    analytics.logConsultOffer({
      offerId,
      from: analyticsFrom,
      moduleName,
      moduleId,
      venueId,
      homeEntryId,
    })
  }

  return (
    <View {...getHeadingAttrs(3)}>
      <StyledTouchableLink
        highlight
        height={height + MAX_OFFER_CAPTION_HEIGHT}
        navigateTo={{
          screen: 'Offer',
          params: { id: offerId, from: analyticsFrom, moduleName, moduleId },
        }}
        onPress={handlePressOffer}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        isFocus={isFocus}
        testID={`offre ${name}`}
        accessibilityLabel={accessibilityLabel}>
        <Container>
          <OfferCaption
            imageWidth={width}
            name={name}
            date={date}
            isDuo={isDuo}
            isBeneficiary={isBeneficiary}
            price={price}
          />
          <View>
            <ImageTile
              width={width}
              height={height - IMAGE_CAPTION_HEIGHT}
              uri={offer.thumbUrl}
              onlyTopBorderRadius
            />
            <ImageCaption
              height={IMAGE_CAPTION_HEIGHT}
              width={width}
              categoryLabel={categoryLabel}
              distance={distance}
            />
          </View>
        </Container>
      </StyledTouchableLink>
    </View>
  )
}

export const OfferTile = memo(UnmemoizedOfferTile)

const IMAGE_CAPTION_HEIGHT = PixelRatio.roundToNearestPixel(MARGIN_DP)
const MAX_OFFER_CAPTION_HEIGHT = getSpacing(18)

const Container = styled.View({ flexDirection: 'column-reverse' })

const StyledTouchableLink = styled(TouchableLink).attrs(({ theme }) => ({
  underlayColor: theme.colors.white,
}))<{ height: number; isFocus?: boolean }>(({ height, theme, isFocus }) => ({
  marginVertical: theme.outline.width + theme.outline.offSet,
  borderRadius: theme.borderRadius.radius,
  height: height,
  ...customFocusOutline(theme, theme.colors.black, isFocus),
}))
