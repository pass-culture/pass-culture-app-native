import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Dimensions } from 'react-native'
import { useQueryClient } from 'react-query'
import styled from 'styled-components/native'

import { mergeOfferData } from 'features/home/atoms/OfferTile'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useDistance } from 'features/offer/components/useDistance'
import { SearchAlgoliaHit } from 'libs/algolia'
import { CATEGORY_CRITERIA } from 'libs/algolia/enums'
import { analytics } from 'libs/analytics'
import { formatDates, getDisplayPrice, parseCategory } from 'libs/parsers'
import { convertEuroToCents } from 'libs/parsers/pricesConversion'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

import { OfferImage } from './OfferImage'

interface Props {
  hit: SearchAlgoliaHit
  query: string
}

export const Hit: React.FC<Props> = ({ hit, query }) => {
  const { offer, objectID, _geoloc } = hit
  const navigation = useNavigation<UseNavigationType>()
  const queryClient = useQueryClient()
  const distanceToOffer = useDistance(_geoloc)

  const timestampsInMillis = offer.dates?.map((timestampInSec) => timestampInSec * 1000)
  const offerId = +objectID
  const categoryLabel = CATEGORY_CRITERIA[offer.category || 'ALL'].label
  const formattedDate = formatDates(timestampsInMillis)
  const prices = offer.prices ? offer.prices.map(convertEuroToCents) : undefined

  function handlePressOffer() {
    // We pre-populate the query-cache with the data from algolia for a smooth transition
    if (!offerId) return
    queryClient.setQueryData(
      ['offer', offerId],
      mergeOfferData({
        ...offer,
        category: parseCategory(offer.category),
        categoryName: offer.category,
        description: offer.description || '',
        thumbUrl: offer.thumbUrl,
        isDuo: offer.isDuo,
        name: offer.name,
        offerId,
      })
    )
    analytics.logConsultOffer({ offerId, from: 'SEARCH', query: query })
    navigation.navigate('Offer', { id: offerId, shouldDisplayLoginModal: false, from: 'search' })
  }

  return (
    <Container onPress={handlePressOffer} testID="offerHit">
      <Row>
        <OfferImage imageUrl={offer.thumbUrl} categoryName={hit.offer.category} />
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
          <Body>{categoryLabel}</Body>
          {formattedDate && <Body>{formattedDate}</Body>}
          <Spacer.Column numberOfSpaces={1} />
          <Typo.Caption>{getDisplayPrice(prices)}</Typo.Caption>
        </Column>
      </Row>
    </Container>
  )
}

const { width } = Dimensions.get('window')
const imageWidth = getSpacing(16)

const Container = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: ACTIVE_OPACITY,
}))({ marginHorizontal: getSpacing(6) })

const columnPadding = 4
const columnMargin = 2 * 6
const Column = styled.View({ width: width - getSpacing(columnMargin + columnPadding) - imageWidth })
const Row = styled.View({ flexDirection: 'row', alignItems: 'center' })

const Name = styled(Typo.ButtonText)({})
const Distance = styled(Typo.Body)({ textAlign: 'right', color: ColorsEnum.GREY_DARK })
const Body = styled(Typo.Body)({ color: ColorsEnum.GREY_DARK })
