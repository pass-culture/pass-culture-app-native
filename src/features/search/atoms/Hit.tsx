import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Dimensions } from 'react-native'
import { useQueryClient } from 'react-query'
import styled from 'styled-components/native'

import { mergeOfferData } from 'features/home/atoms/OfferTile'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { dehumanizeId } from 'features/offer/services/dehumanizeId'
import { AlgoliaHit } from 'libs/algolia'
import { formatDates, formatDistance, getDisplayPrice, parseCategory } from 'libs/parsers'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

interface Props {
  hit: AlgoliaHit
}

// TODO: get real position from useGeolocation. This corresponds to Eiffel tower
const position = {
  latitude: 48.85,
  longitude: 2.29,
  accuracy: 1,
  altitude: null,
  heading: null,
  speed: null,
  altitudeAccuracy: null,
}

export const Hit: React.FC<Props> = ({ hit }) => {
  const { offer, _geoloc } = hit
  const navigation = useNavigation<UseNavigationType>()
  const queryClient = useQueryClient()

  const timestampsInMillis = offer.dates?.map((timestampInSec) => timestampInSec * 1000)
  const offerId = dehumanizeId(offer.id)

  function handlePressOffer() {
    // We pre-populate the query-cache with the data from algolia for a smooth transition
    if (!offerId) return
    queryClient.setQueryData(
      ['offer', offerId],
      mergeOfferData({
        ...offer,
        category: parseCategory(offer.category),
        description: offer.description || '',
        thumbUrl: offer.thumbUrl,
        isDuo: offer.isDuo,
        name: offer.name,
        offerId,
      })
    )
    navigation.navigate('Offer', { id: offerId })
  }

  return (
    <Container onPress={handlePressOffer} testID="offerHit">
      <Row>
        <Image resizeMode="cover" source={{ uri: offer.thumbUrl }} />
        <Column>
          <Row>
            <Spacer.Flex flex={0.7}>
              <Name numberOfLines={2}>{offer.name}</Name>
            </Spacer.Flex>
            <Spacer.Flex flex={0.3}>
              <Distance>{formatDistance(_geoloc, position)}</Distance>
            </Spacer.Flex>
          </Row>
          <Spacer.Column numberOfSpaces={1} />
          <Body>{parseCategory(offer.category)}</Body>
          <Body>{formatDates(timestampsInMillis) || 'Dès le 31 janvier 2021'}</Body>
          <Spacer.Column numberOfSpaces={1} />
          <Typo.Caption>{getDisplayPrice(offer.prices)}</Typo.Caption>
        </Column>
      </Row>
    </Container>
  )
}

const { width } = Dimensions.get('window')
const imageWidth = getSpacing(16)
const imageHeight = getSpacing(24) // ratio 2/3

const Container = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: ACTIVE_OPACITY,
}))({ marginHorizontal: getSpacing(6) })

const Column = styled.View({ width: width - getSpacing(2 * 6 + 4) - imageWidth })
const Row = styled.View({ flexDirection: 'row', alignItems: 'center' })

const Name = styled(Typo.ButtonText)({})
const Distance = styled(Typo.Body)({ textAlign: 'right', color: ColorsEnum.GREY_DARK })
const Body = styled(Typo.Body)({ color: ColorsEnum.GREY_DARK })

const Image = styled.Image({
  borderRadius: 4,
  height: imageHeight,
  width: imageWidth,
  marginRight: getSpacing(4),
})
