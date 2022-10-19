import React from 'react'
import { useQueryClient } from 'react-query'
import styled from 'styled-components/native'

import { mergeOfferData } from 'features/offer/atoms/OfferTile'
import { useLogClickOnOffer } from 'libs/algolia/analytics/logClickOnOffer'
import { analytics } from 'libs/firebase/analytics'
import { useDistance } from 'libs/geolocation/hooks/useDistance'
import { formatDates, getDisplayPrice } from 'libs/parsers'
import { QueryKeys } from 'libs/queryKeys'
import { SearchHit } from 'libs/search'
import { useSubcategory } from 'libs/subcategories'
import { useSearchGroupLabel } from 'libs/subcategories/useSearchGroupLabel'
import { tileAccessibilityLabel, TileContentType } from 'libs/tileAccessibilityLabel'
import { OfferImage } from 'ui/components/tiles/OfferImage'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { getSpacing, Spacer, Typo } from 'ui/theme'
interface Props {
  hit: SearchHit
  query: string
  index: number
}

export const Hit: React.FC<Props> = ({ hit, query, index }) => {
  const { offer, objectID, _geoloc } = hit
  const { subcategoryId, dates, prices } = offer
  const queryClient = useQueryClient()
  const distanceToOffer = useDistance(_geoloc)
  const { categoryId, searchGroupName } = useSubcategory(subcategoryId)
  const searchGroupLabel = useSearchGroupLabel(searchGroupName)
  const { logClickOnOffer } = useLogClickOnOffer()

  const timestampsInMillis = dates?.map((timestampInSec) => timestampInSec * 1000)
  const offerId = +objectID
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
    // We pre-populate the query-cache with the data from the search client for a smooth transition
    if (!offerId) return
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
    analytics.logConsultOffer({ offerId, from: 'search', query: query })
    logClickOnOffer({ objectID, position: index })
  }

  return (
    <Container
      navigateTo={
        offerId ? { screen: 'Offer', params: { id: offerId, from: 'search' } } : undefined
      }
      onBeforeNavigate={handlePressOffer}
      accessibilityLabel={accessibilityLabel}>
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
        <Body ellipsizeMode="tail" numberOfLines={1}>
          {searchGroupLabel}
        </Body>
        {!!formattedDate && <Body>{formattedDate}</Body>}
        <Spacer.Column numberOfSpaces={1} />
        <Typo.Caption>{formattedPrice}</Typo.Caption>
      </Column>
    </Container>
  )
}

const Container = styled(TouchableLink)({
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
