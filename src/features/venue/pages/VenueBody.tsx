import React, { FunctionComponent, useRef } from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { LocationPointer } from 'ui/svg/icons/LocationPointer'
import { getSpacing, Typo } from 'ui/theme'

import { useVenue } from '../api/useVenue'

export const VenueBody: FunctionComponent<{
  venueId: number
  onScroll: () => void
}> = ({ venueId, onScroll }) => {
  const { data: venueResponse } = useVenue(venueId)
  const scrollViewRef = useRef<ScrollView | null>(null)

  // TODO : Remove after add all venue informations - (it's just for scroll)
  const lorem =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque molestiae ea sunt. Voluptatibus, ipsam eum! Sapiente, corrupti laborum! Magni officiis nihil nostrum ad culpa quidem neque asperiores adipisci. Maiores, nostrum.'

  if (!venueResponse) return <React.Fragment></React.Fragment>

  const { address, postalCode, city, publicName } = venueResponse
  const venueAddress = address
    ? `${address}, ${postalCode} ${city}`
    : `${publicName}, ${postalCode} ${city}`

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
        <VenueAddressContainer>
          <IconContainer>
            <LocationPointer size={getSpacing(4)} />
          </IconContainer>
          <StyledText numberOfLines={1}>{venueAddress}</StyledText>
        </VenueAddressContainer>
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

const VenueAddressContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: getSpacing(10),
})

const IconContainer = styled.View({
  marginRight: getSpacing(1),
})

const StyledText = styled(Typo.Caption)({
  flexShrink: 1,
  textTransform: 'capitalize',
})
