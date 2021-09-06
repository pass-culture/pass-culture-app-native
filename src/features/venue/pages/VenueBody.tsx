import { t } from '@lingui/macro'
import React, { FunctionComponent, useRef, useState } from 'react'
import { LayoutChangeEvent, ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { useAppSettings } from 'features/auth/settings'
import { useVenueOffers } from 'features/venue/api/useVenueOffers'
import { VenueIconCaptions } from 'features/venue/components/VenueIconCaptions'
import { VenueOffers } from 'features/venue/components/VenueOffers'
import { WhereSection } from 'libs/geolocation/components/WhereSection'
import { parseType } from 'libs/parsers'
import { highlightLinks } from 'libs/parsers/highlightLinks'
import { AccessibilityBlock } from 'ui/components/accessibility/AccessibilityBlock'
import { AccordionItem } from 'ui/components/AccordionItem'
import { Hero } from 'ui/components/hero/Hero'
import { PartialAccordionDescription } from 'ui/components/PartialAccordionDescription'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'
import { getSpacing, Spacer, Typo } from 'ui/theme'

import { useVenue } from '../api/useVenue'

interface Props {
  venueId: number
  onScroll: () => void
}

export const VenueBody: FunctionComponent<Props> = ({ venueId, onScroll }) => {
  const { data: venue } = useVenue(venueId)
  const { data: offers } = useVenueOffers(venueId)
  const { data: settings } = useAppSettings()
  const scrollViewRef = useRef<ScrollView | null>(null)
  const [bodyPositionY, setBodyPositionY] = useState<number>(0)

  if (!venue) return <React.Fragment></React.Fragment>

  const {
    address,
    postalCode,
    city,
    publicName,
    // withdrawalDetails,
    latitude,
    longitude,
    venueTypeCode,
    description,
  } = venue

  // TODO (Lucasbeneston) : Remove after add accordionItem Animation
  const withdrawalDetails =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis commodi fugit accusantium omnis adipisci, quod libero quis natus saepe accusamus, odit mollitia ipsa iure sunt nesciunt pariatur error recusandae optio!'

  // TODO (Lucasbeneston) : Remove after new render API with accessibility object
  const accessibility = {
    audioDisability: true,
    mentalDisability: false,
    motorDisability: true,
    visualDisability: false,
  }

  const venueAddress = address
    ? `${address}, ${postalCode} ${city}`
    : `${publicName}, ${postalCode} ${city}`

  const typeLabel = parseType(venueTypeCode)

  const shouldShowVenueOffers = !!settings?.useAppSearch && !!offers && offers?.hits.length > 0

  const getPositionOfAccordionItem = (event: LayoutChangeEvent) => {
    setBodyPositionY(event.nativeEvent.layout.y)
  }

  const scrollToTopOfAccordionItem = () => {
    if (scrollViewRef !== null && scrollViewRef.current !== null) {
      scrollViewRef.current.scrollTo({ x: 0, y: bodyPositionY, animated: true })
    }
  }

  return (
    <Container
      testID="venue-container"
      scrollEventThrottle={20}
      scrollIndicatorInsets={scrollIndicatorInsets}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={scrollViewRef as any}
      bounces={false}
      onScroll={onScroll}>
      {/* TODO(antoinewg, #10099) use the image once we have it */}
      <Hero imageUrl={undefined} type="venue" venueType={venueTypeCode || null} />
      <Spacer.Column numberOfSpaces={4} />
      <MarginContainer>
        <VenueAddressContainer>
          <IconContainer>
            <LocationPointer size={getSpacing(4)} />
          </IconContainer>
          <StyledText numberOfLines={1}>{venueAddress}</StyledText>
        </VenueAddressContainer>
        <Spacer.Column numberOfSpaces={2} />
        <VenueTitle
          testID="venueTitle"
          numberOfLines={2}
          adjustsFontSizeToFit
          allowFontScaling={false}>
          {venue.name}
        </VenueTitle>
        <Spacer.Column numberOfSpaces={4} />
      </MarginContainer>

      <VenueIconCaptions
        type={venueTypeCode || null}
        label={typeLabel}
        locationCoordinates={{ latitude, longitude }}
      />

      {/* Description */}
      <PartialAccordionDescription description={description || ''} />

      {/* Offres */}
      <SectionWithDivider visible={shouldShowVenueOffers}>
        <VenueOffers venueId={venueId} />
      </SectionWithDivider>

      {/* Où */}
      <SectionWithDivider visible margin>
        <WhereSection
          venue={venue}
          address={venueAddress}
          locationCoordinates={{ latitude, longitude }}
        />
      </SectionWithDivider>

      {/* Modalités de retrait */}
      <SectionWithDivider visible={!!withdrawalDetails}>
        <AccordionItem
          title={t`Modalités de retrait`}
          onLayout={getPositionOfAccordionItem}
          onOpen={scrollToTopOfAccordionItem}>
          <Typo.Body>{withdrawalDetails && highlightLinks(withdrawalDetails)}</Typo.Body>
        </AccordionItem>
      </SectionWithDivider>

      {/* Accessibilité */}
      <SectionWithDivider
        visible={Object.values(accessibility).some(
          (value) => value !== undefined && value !== null
        )}>
        <AccordionItem
          title={t`Accessibilité`}
          onLayout={getPositionOfAccordionItem}
          onOpen={scrollToTopOfAccordionItem}>
          <AccessibilityBlock {...accessibility} />
        </AccordionItem>
      </SectionWithDivider>

      <SectionWithDivider visible>
        <Spacer.Column numberOfSpaces={6} />
      </SectionWithDivider>
    </Container>
  )
}

const scrollIndicatorInsets = { right: 1 }

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
