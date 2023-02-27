import React from 'react'
import { useQueryClient } from 'react-query'
import styled from 'styled-components/native'

import { mergeOfferData } from 'features/offer/components/OfferTile/OfferTile'
import { NativeCategoryValue } from 'features/search/components/NativeCategoryValue/NativeCategoryValue'
import { SearchHit } from 'libs/algolia'
import { useLogClickOnOffer } from 'libs/algolia/analytics/logClickOnOffer'
import { analytics } from 'libs/firebase/analytics'
import { useDistance } from 'libs/geolocation/hooks/useDistance'
import { formatDates, getDisplayPrice } from 'libs/parsers'
import { QueryKeys } from 'libs/queryKeys'
import { useSubcategory } from 'libs/subcategories'
import { useSearchGroupLabel } from 'libs/subcategories/useSearchGroupLabel'
import { tileAccessibilityLabel, TileContentType } from 'libs/tileAccessibilityLabel'
import { OfferImage } from 'ui/components/tiles/OfferImage'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { getSpacing, Spacer, Typo } from 'ui/theme'
interface Props {
  hit: SearchHit
  query: string
  index: number
  searchId?: string
}

export const Hit = ({ hit, query, index, searchId }: Props) => {
  const { offer, objectID, _geoloc } = hit
  const { subcategoryId, dates, prices } = offer
  const queryClient = useQueryClient()
  const distanceToOffer = useDistance(_geoloc)
  const { categoryId, searchGroupName, nativeCategoryId } = useSubcategory(subcategoryId)
  const searchGroupLabel = useSearchGroupLabel(searchGroupName)
  const { logClickOnOffer } = useLogClickOnOffer()

  const timestampsInMillis = dates?.map((timestampInSec) => timestampInSec * 1000)
  const offerId = Number(objectID)

  const formattedDate = formatDates(timestampsInMillis)
  const formattedPrice = getDisplayPrice(prices)

  const accessibilityLabel = tileAccessibilityLabel(TileContentType.OFFER, {
    ...offer,
    categoryLabel: searchGroupLabel,
    distance: distanceToOffer,
    date: formattedDate,
    price: formattedPrice,
  })

  function handlePressOffer() {
    if (!offerId) return
    // We pre-populate the query-cache with the data from the search client for a smooth transition
    queryClient.setQueryData(
      [QueryKeys.OFFER, offerId],
      mergeOfferData({
        ...offer,
        categoryId,
        thumbUrl: offer.thumbUrl,
        isDuo: offer.isDuo,
        name: offer.name,
        offerId,
      })
    )

    analytics.logConsultOffer({ offerId, from: 'search', query, searchId })
    logClickOnOffer({ objectID, position: index })
  }

  return (
    <Container
      navigateTo={{ screen: 'Offer', params: { id: offerId, from: 'search', searchId } }}
      onBeforeNavigate={handlePressOffer}
      accessibilityLabel={accessibilityLabel}
      enableNavigate={!!offerId}>
      <OfferImage imageUrl={offer.thumbUrl} categoryId={categoryId} />
      <Spacer.Row numberOfSpaces={4} />
      <Column>
        <Row>
          {distanceToOffer ? (
            <React.Fragment>
              <Spacer.Flex flex={0.7}>
                <Name numberOfLines={2}>{offer.name}</Name>
              </Spacer.Flex>
              <Spacer.Flex flex={0.3}>
                <Distance>{distanceToOffer}</Distance>
              </Spacer.Flex>
            </React.Fragment>
          ) : (
            <Name numberOfLines={2}>{offer.name}</Name>
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

const Container: typeof InternalTouchableLink = styled(InternalTouchableLink)({
  marginHorizontal: getSpacing(6),
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
