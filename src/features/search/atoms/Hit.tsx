import React from 'react'
import { Dimensions } from 'react-native'
import styled from 'styled-components/native'

import { AlgoliaHit } from 'libs/algolia'
import { formatDates, formatDistance, getDisplayPrice, parseCategory } from 'libs/parsers'
import { getSpacing, Spacer, Typo } from 'ui/theme'

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
  const timestampsInMillis = offer.dates?.map((timestampInSec) => timestampInSec * 1000)

  return (
    <Container>
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
          <Typo.Body>{parseCategory(offer.category)}</Typo.Body>
          <Typo.Body>{formatDates(timestampsInMillis) || 'Dès le 31 janvier 2021'}</Typo.Body>
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

const Container = styled.View({ marginVertical: getSpacing(4), marginHorizontal: getSpacing(6) })
const Column = styled.View({ width: width - getSpacing(2 * 6 + 4) - imageWidth })
const Row = styled.View({ flexDirection: 'row' })

const Name = styled(Typo.ButtonText)({})
const Distance = styled(Typo.Body)({ textAlign: 'right' })

const Image = styled.Image({
  borderRadius: 4,
  height: imageHeight,
  width: imageWidth,
  marginRight: getSpacing(4),
})
