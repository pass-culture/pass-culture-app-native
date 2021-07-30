import { t } from '@lingui/macro'
import React, { FunctionComponent, useRef } from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { VenueOffers } from 'features/venue/components/VenueOffers'
import { WhereSection } from 'libs/geolocation/components/WhereSection'
import { highlightLinks } from 'libs/parsers/highlightLinks'
import { AccordionItem } from 'ui/components/AccordionItem'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'
import { Spacer, getSpacing, Typo } from 'ui/theme'

import { useVenue } from '../api/useVenue'

interface Props {
  venueId: number
  onScroll: () => void
}

const lorem =
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque molestiae ea sunt. Voluptatibus, ipsam eum! Sapiente, corrupti laborum! Magni officiis nihil nostrum ad culpa quidem neque asperiores adipisci. Maiores, nostrum.'

export const VenueBody: FunctionComponent<Props> = ({ venueId, onScroll }) => {
  const { data: venue } = useVenue(venueId)
  const scrollViewRef = useRef<ScrollView | null>(null)

  if (!venue) return <React.Fragment></React.Fragment>

  const { address, postalCode, city, publicName, withdrawalDetails, latitude, longitude } = venue
  const venueAddress = address
    ? `${address}, ${postalCode} ${city}`
    : `${publicName}, ${postalCode} ${city}`

  return (
    <Container
      testID="venue-container"
      scrollEventThrottle={20}
      scrollIndicatorInsets={{ right: 1 }}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={scrollViewRef as any}
      bounces={false}
      onScroll={onScroll}>
      {/* TODO(antoinewg) remove the topscreens when adding the image */}
      <Spacer.TopScreen />
      <Spacer.TopScreen />
      <Spacer.TopScreen />

      <MarginContainer>
        <VenueTitle
          testID="venueTitle"
          numberOfLines={2}
          adjustsFontSizeToFit
          allowFontScaling={false}>
          {venue.name}
        </VenueTitle>

        <VenueAddressContainer>
          <IconContainer>
            <LocationPointer size={getSpacing(4)} />
          </IconContainer>
          <StyledText numberOfLines={1}>{venueAddress}</StyledText>
        </VenueAddressContainer>
        <Spacer.Column numberOfSpaces={6} />
      </MarginContainer>

      {/* TODO(antoinewg) Remove after add all venue informations - (it's just for scroll) */}
      <SectionWithDivider margin visible>
        <Typo.Body>{lorem.repeat(6)}</Typo.Body>
      </SectionWithDivider>

      <SectionWithDivider visible margin>
        <VenueOffers venueId={venueId} />
      </SectionWithDivider>

      <SectionWithDivider visible margin>
        <WhereSection address={venueAddress} locationCoordinates={{ latitude, longitude }} />
      </SectionWithDivider>

      <SectionWithDivider visible={!!withdrawalDetails}>
        <AccordionItem title={t`Modalités de retrait`}>
          <Typo.Body>{withdrawalDetails && highlightLinks(withdrawalDetails)}</Typo.Body>
        </AccordionItem>
      </SectionWithDivider>

      <SectionWithDivider visible>
        <Spacer.Column numberOfSpaces={6} />
      </SectionWithDivider>
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
