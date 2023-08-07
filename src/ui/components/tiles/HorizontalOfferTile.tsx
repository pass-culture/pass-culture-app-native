import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { NativeCategoryValue } from 'features/search/components/NativeCategoryValue/NativeCategoryValue'
import { useLogClickOnOffer } from 'libs/algolia/analytics/logClickOnOffer'
import { analytics } from 'libs/analytics'
import { OfferAnalyticsParams } from 'libs/analytics/types'
import { useDistance } from 'libs/geolocation/hooks/useDistance'
import { formatDates, getDisplayPrice } from 'libs/parsers'
import { useSubcategory } from 'libs/subcategories'
import { useSearchGroupLabel } from 'libs/subcategories/useSearchGroupLabel'
import { tileAccessibilityLabel, TileContentType } from 'libs/tileAccessibilityLabel'
import { Offer } from 'shared/offer/types'
import { usePrePopulateOffer } from 'shared/offer/usePrePopulateOffer'
import { OfferImage } from 'ui/components/tiles/OfferImage'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Spacer, Typo } from 'ui/theme'
interface Props {
  offer: Offer
  onPress?: () => void
  analyticsParams: OfferAnalyticsParams
  style?: StyleProp<ViewStyle>
}

export const HorizontalOfferTile = ({ offer, analyticsParams, onPress, style }: Props) => {
  const { offer: offerDetails, objectID, _geoloc } = offer
  const { subcategoryId, dates, prices } = offerDetails
  const prePopulateOffer = usePrePopulateOffer()
  const distanceToOffer = useDistance(_geoloc)
  const { categoryId, searchGroupName, nativeCategoryId } = useSubcategory(subcategoryId)
  const searchGroupLabel = useSearchGroupLabel(searchGroupName)
  const { logClickOnOffer } = useLogClickOnOffer()

  const timestampsInMillis = dates?.map((timestampInSec) => timestampInSec * 1000)
  const offerId = Number(objectID)

  const formattedDate = formatDates(timestampsInMillis)
  const formattedPrice = getDisplayPrice(prices)

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
      <OfferImage imageUrl={offerDetails.thumbUrl} categoryId={categoryId} />
      <Spacer.Row numberOfSpaces={4} />
      <Column>
        <Row>
          {distanceToOffer ? (
            <React.Fragment>
              <Spacer.Flex flex={0.7}>
                <Name numberOfLines={2}>{offerDetails.name}</Name>
              </Spacer.Flex>
              <Spacer.Flex flex={0.3}>
                <Distance>{distanceToOffer}</Distance>
              </Spacer.Flex>
            </React.Fragment>
          ) : (
            <Name numberOfLines={2}>{offerDetails.name}</Name>
          )}
        </Row>
        <Spacer.Column numberOfSpaces={1} />
        <NativeCategoryValue nativeCategoryId={nativeCategoryId} />
        {!!formattedDate && <Body>{formattedDate}</Body>}
        <Spacer.Column numberOfSpaces={1} />
        <Typo.Caption>{formattedPrice}</Typo.Caption>
      </Column>
    </Container>
  )
}

const Container = styled(InternalTouchableLink)({
  flexDirection: 'row',
  alignItems: 'center',
  outlineOffset: 0,
})

const Column = styled.View({ flexDirection: 'column', flex: 1 })

const Row = styled.View({ flexDirection: 'row', alignItems: 'center' })

const Name = styled(Typo.ButtonText)``

const Distance = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'right',
  color: theme.colors.greyDark,
}))

const Body = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
