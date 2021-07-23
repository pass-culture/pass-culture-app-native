import React, { FunctionComponent, useRef } from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { getSpacing, Typo } from 'ui/theme'

import { useVenue } from '../api/useVenue'

export const VenueBody: FunctionComponent<{
  venueId: number
  onScroll: () => void
}> = ({ venueId, onScroll }) => {
  const { data: venueResponse } = useVenue(venueId)
  const scrollViewRef = useRef<ScrollView | null>(null)

  const lorem =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque molestiae ea sunt. Voluptatibus, ipsam eum! Sapiente, corrupti laborum! Magni officiis nihil nostrum ad culpa quidem neque asperiores adipisci. Maiores, nostrum.'

  if (!venueResponse) return <React.Fragment></React.Fragment>

  return (
    <Container
      testID="venue-container"
      scrollEventThrottle={10}
      scrollIndicatorInsets={{ right: 1 }}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={scrollViewRef as any}
      bounces={false}
      onScroll={onScroll}>
      <MarginContainer>
        <VenueTitle
          testID="venueTitle"
          numberOfLines={2}
          adjustsFontSizeToFit
          allowFontScaling={false}>
          {venueResponse.name}
        </VenueTitle>
        <Typo.Body>{venueResponse.id}</Typo.Body>
        <Typo.Body>{lorem.repeat(12)}</Typo.Body>
      </MarginContainer>
    </Container>
  )
}

const Container = styled.ScrollView({})
const VenueTitle = styled(Typo.Title3)({ textAlign: 'center' })

const MarginContainer = styled.View({
  marginHorizontal: getSpacing(6),
})
