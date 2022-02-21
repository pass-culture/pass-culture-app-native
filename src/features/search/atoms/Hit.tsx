import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { StyleSheet } from 'react-native'
import { useQueryClient } from 'react-query'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { mergeOfferData } from 'features/offer/atoms/OfferTile'
import { analytics } from 'libs/analytics'
import { useDistance } from 'libs/geolocation/hooks/useDistance'
import { formatDates, getDisplayPrice } from 'libs/parsers'
import { QueryKeys } from 'libs/queryKeys'
import { GLOBAL_STALE_TIME } from 'libs/react-query/queryClient'
import { SearchHit } from 'libs/search'
import { useSubcategory } from 'libs/subcategories'
import { useSearchGroupLabel } from 'libs/subcategories/useSearchGroupLabel'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { Link } from 'ui/web/link/Link'

import { OfferImage } from './OfferImage'

interface Props {
  hit: SearchHit
  query: string
}

export const Hit: React.FC<Props> = ({ hit, query }) => {
  const { offer, objectID, _geoloc } = hit
  const navigation = useNavigation<UseNavigationType>()
  const queryClient = useQueryClient()
  const distanceToOffer = useDistance(_geoloc)
  const { categoryId, searchGroupName } = useSubcategory(offer.subcategoryId)
  const searchGroupLabel = useSearchGroupLabel(searchGroupName)

  const timestampsInMillis = offer.dates?.map((timestampInSec) => timestampInSec * 1000)
  const offerId = +objectID
  const formattedDate = formatDates(timestampsInMillis)

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
      }),
      {
        // Make sure the data is stale, so that it is considered as a placeholder
        updatedAt: Date.now() - (GLOBAL_STALE_TIME + 1),
      }
    )
    analytics.logConsultOffer({ offerId, from: 'search', query: query })
    navigation.navigate('Offer', { id: offerId, from: 'search' })
  }

  return (
    <Container onPress={handlePressOffer} testID="offerHit">
      <Link
        to={{ screen: 'Offer', params: { id: offerId, from: 'search' } }}
        style={styles.link}
        accessible={false}>
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
          <Body>{searchGroupLabel}</Body>
          {!!formattedDate && <Body>{formattedDate}</Body>}
          <Spacer.Column numberOfSpaces={1} />
          <Typo.Caption>{getDisplayPrice(offer.prices)}</Typo.Caption>
        </Column>
      </Link>
    </Container>
  )
}

const Container = styled.TouchableOpacity.attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
}))({
  marginHorizontal: getSpacing(6),
  flexDirection: 'row',
  alignItems: 'center',
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

const styles = StyleSheet.create({
  link: {
    flex: 1,
    flexDirection: 'row',
    display: 'flex',
  },
})
