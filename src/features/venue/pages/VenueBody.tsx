import { t } from '@lingui/macro'
import React, { FunctionComponent, useRef } from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { CategoryNameEnum } from 'api/gen'
import { useAppSettings } from 'features/auth/settings'
import { useVenueOffers } from 'features/venue/api/useVenueOffers'
import { VenueOffers } from 'features/venue/components/VenueOffers'
import { WhereSection } from 'libs/geolocation/components/WhereSection'
import { highlightLinks } from 'libs/parsers/highlightLinks'
import { AccordionItem } from 'ui/components/AccordionItem'
import { Hero } from 'ui/components/hero/Hero'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'
import { getSpacing, Spacer, Typo } from 'ui/theme'

import { useVenue } from '../api/useVenue'

interface Props {
  venueId: number
  onScroll: () => void
}

const lorem =
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque molestiae ea sunt. Voluptatibus, ipsam eum! Sapiente, corrupti laborum! Magni officiis nihil nostrum ad culpa quidem neque asperiores adipisci. Maiores, nostrum.'

export const VenueBody: FunctionComponent<Props> = ({ venueId, onScroll }) => {
  const { data: venue } = useVenue(venueId)
  const { data: offers } = useVenueOffers(venueId)
  const scrollViewRef = useRef<ScrollView | null>(null)
  const { data: settings } = useAppSettings()

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
      <Hero categoryName={CategoryNameEnum.MUSIQUE} imageUrl="" landscape />
      <Spacer.Column numberOfSpaces={6} />
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
        <Spacer.Column numberOfSpaces={6} />
        <Typo.Body>{lorem}</Typo.Body>
        <Spacer.Column numberOfSpaces={6} />
      </SectionWithDivider>

      {/* TODO(antoinewg) Show only if app search is enabled */}
      <SectionWithDivider visible={!settings?.useAppSearch && !!offers && offers?.length > 0}>
        <VenueOffers venueId={venueId} />
      </SectionWithDivider>

      <SectionWithDivider visible margin>
        <WhereSection
          venue={venue}
          address={venueAddress}
          locationCoordinates={{ latitude, longitude }}
        />
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
  justifyContent: 'center',
  marginTop: getSpacing(2),
})

const IconContainer = styled.View({
  marginRight: getSpacing(1),
})

const StyledText = styled(Typo.Caption)({
  flexShrink: 1,
  textTransform: 'capitalize',
})
