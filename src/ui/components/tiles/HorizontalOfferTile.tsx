import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { useLogClickOnOffer } from 'libs/algolia/analytics/logClickOnOffer'
import { analytics } from 'libs/analytics'
import { OfferAnalyticsParams } from 'libs/analytics/types'
import { useDistance } from 'libs/location/hooks/useDistance'
import { formatDates } from 'libs/parsers/formatDates'
import { getDisplayPrice } from 'libs/parsers/getDisplayPrice'
import { useSubcategory } from 'libs/subcategories'
import { useSearchGroupLabel } from 'libs/subcategories/useSearchGroupLabel'
import { tileAccessibilityLabel, TileContentType } from 'libs/tileAccessibilityLabel'
import { Offer } from 'shared/offer/types'
import { usePrePopulateOffer } from 'shared/offer/usePrePopulateOffer'
import { GetNativeCategoryValue } from 'ui/components/tiles/utils'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'

import { HorizontalTile } from './HorizontalTile'
interface Props {
  offer: Offer
  onPress?: () => void
  analyticsParams: OfferAnalyticsParams
  style?: StyleProp<ViewStyle>
  withRightArrow?: boolean
}

export const HorizontalOfferTile = ({
  offer,
  analyticsParams,
  onPress,
  style,
  withRightArrow,
}: Props) => {
  const { offer: offerDetails, objectID, _geoloc } = offer
  const { subcategoryId, dates, prices, thumbUrl, name } = offerDetails
  const prePopulateOffer = usePrePopulateOffer()
  const distanceToOffer = useDistance(_geoloc)
  const { categoryId, searchGroupName, nativeCategoryId } = useSubcategory(subcategoryId)
  const searchGroupLabel = useSearchGroupLabel(searchGroupName)
  const { logClickOnOffer } = useLogClickOnOffer()

  const timestampsInMillis = dates?.map((timestampInSec) => timestampInSec * 1000)
  const offerId = Number(objectID)

  const formattedDate = formatDates(timestampsInMillis)
  const formattedPrice = getDisplayPrice(prices)
  const nativeCategoryValue = GetNativeCategoryValue({ nativeCategoryId })

  const accessibilityLabel = tileAccessibilityLabel(TileContentType.OFFER, {
    ...offerDetails,
    categoryLabel: searchGroupLabel,
    distance: distanceToOffer,
    date: formattedDate,
    price: formattedPrice,
  })
  function handlePressOffer() {
    if (!offerId) return
    if (onPress) onPress()
    // We pre-populate the query-cache with the data from the search client for a smooth transition
    prePopulateOffer({
      ...offerDetails,
      categoryId,
      thumbUrl: offerDetails.thumbUrl,
      isDuo: offerDetails.isDuo,
      name: offerDetails.name,
      offerId,
    })

    analytics.logConsultOffer({
      offerId,
      ...analyticsParams,
    })

    if (analyticsParams.from === 'search')
      logClickOnOffer({ objectID, position: analyticsParams.index ?? 0 })
  }

  const subtitles = []
  if (nativeCategoryValue) subtitles.push(nativeCategoryValue)
  if (formattedDate) subtitles.push(formattedDate)

  return (
    <Container
      navigateTo={{
        screen: 'Offer',
        params: { id: offerId, from: analyticsParams.from, searchId: analyticsParams.searchId },
      }}
      onBeforeNavigate={handlePressOffer}
      accessibilityLabel={accessibilityLabel}
      enableNavigate={!!offerId}
      from={analyticsParams.from}
      style={style}>
      <HorizontalTile
        categoryId={categoryId}
        title={name as string}
        imageUrl={thumbUrl}
        distanceToOffer={distanceToOffer}
        subtitles={subtitles}
        price={formattedPrice}
        withRightArrow={withRightArrow}
      />
    </Container>
  )
}

const Container = styled(InternalTouchableLink)({
  flexDirection: 'row',
  alignItems: 'center',
  outlineOffset: 0,
})
