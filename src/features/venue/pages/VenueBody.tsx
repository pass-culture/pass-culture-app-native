import { t } from '@lingui/macro'
import React, { FunctionComponent, useRef } from 'react'
import { ScrollView } from 'react-native'
import webStyled from 'styled-components'
import styled from 'styled-components/native'

import { useVenueOffers } from 'features/venue/api/useVenueOffers'
import { VenueIconCaptions } from 'features/venue/components/VenueIconCaptions'
import { VenueOffers } from 'features/venue/components/VenueOffers'
import { formatFullAddress } from 'libs/address/useFormatFullAddress'
import { analytics } from 'libs/analytics'
import { WhereSection } from 'libs/geolocation/components/WhereSection'
import { parseType, VenueTypeCode } from 'libs/parsers'
import { highlightLinks } from 'libs/parsers/highlightLinks'
import { AccessibilityBlock } from 'ui/components/accessibility/AccessibilityBlock'
import { AccordionItem } from 'ui/components/AccordionItem'
import { ContactBlock } from 'ui/components/contact/ContactBlock'
import { Hero } from 'ui/components/hero/Hero'
import { PartialAccordionDescription } from 'ui/components/PartialAccordionDescription'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { LocationPointer as DefaultLocationPointer } from 'ui/svg/icons/LocationPointer'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { Dd } from 'ui/web/list/Dd'
import { Dl } from 'ui/web/list/Dl'
import { Dt } from 'ui/web/list/Dt'

import { useVenue } from '../api/useVenue'

interface Props {
  venueId: number
  onScroll: () => void
}

export const VenueBody: FunctionComponent<Props> = ({ venueId, onScroll }) => {
  const { data: venue } = useVenue(venueId)
  const { data: offers } = useVenueOffers(venueId)
  const scrollViewRef = useRef<ScrollView | null>(null)

  if (!venue) return <React.Fragment></React.Fragment>

  const {
    address,
    postalCode,
    bannerUrl,
    city,
    publicName,
    withdrawalDetails,
    latitude,
    longitude,
    venueTypeCode,
    description,
    accessibility,
    contact,
    name,
  } = venue
  const venueType = venueTypeCode as VenueTypeCode

  const venueAddress = formatFullAddress(address || publicName, postalCode, city)
  const typeLabel = parseType(venueType)

  const shouldShowVenueOffers = !!offers && offers?.hits.length > 0
  const shouldShowAccessibility = Object.values(accessibility).some(
    (value) => value !== undefined && value !== null
  )
  const shouldShowContact = !!contact?.email || !!contact?.phoneNumber || !!contact?.website

  return (
    <Container
      testID="venue-container"
      scrollEventThrottle={20}
      scrollIndicatorInsets={scrollIndicatorInsets}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={scrollViewRef as any}
      bounces={false}
      onScroll={onScroll}>
      <Hero imageUrl={bannerUrl || undefined} type="venue" venueType={venueType || null} />
      <Spacer.Column numberOfSpaces={4} />
      <Dl>
        <MarginContainer>
          <VenueAddressContainer>
            <IconContainer>
              <LocationPointer accessibilityLabel={t`Adresse`} />
            </IconContainer>
            <StyledText numberOfLines={1}>{venueAddress}</StyledText>
          </VenueAddressContainer>
          <Spacer.Column numberOfSpaces={2} />
          <HiddenTitle>{t`Lieu`}</HiddenTitle>
          <VenueTitle
            testID="venueTitle"
            numberOfLines={2}
            adjustsFontSizeToFit
            allowFontScaling={false}>
            {publicName || name}
          </VenueTitle>
          <Spacer.Column numberOfSpaces={4} />
        </MarginContainer>

        <VenueIconCaptions
          type={venueType || null}
          label={typeLabel}
          locationCoordinates={{ latitude, longitude }}
        />

        {/* Description */}
        <HiddenTitle>{t`Description`}</HiddenTitle>
        <PartialAccordionDescription description={description || ''} />

        {/* Offres */}
        <SectionWithDivider visible={shouldShowVenueOffers}>
          <VenueOffers venueId={venueId} />
        </SectionWithDivider>

        {/* Où */}
        <SectionWithDivider visible margin>
          <WhereSection
            beforeNavigateToItinerary={() =>
              analytics.logConsultItinerary({ venueId, from: 'venue' })
            }
            venue={venue}
            address={venueAddress}
            locationCoordinates={{ latitude, longitude }}
          />
        </SectionWithDivider>
      </Dl>

      {/* Modalités de retrait */}
      <SectionWithDivider visible={!!withdrawalDetails}>
        <AccordionItem
          title={t`Modalités de retrait`}
          scrollViewRef={scrollViewRef}
          onOpenOnce={() => analytics.logConsultWithdrawal({ venueId })}>
          <Typo.Body>{withdrawalDetails && highlightLinks(withdrawalDetails)}</Typo.Body>
        </AccordionItem>
      </SectionWithDivider>

      {/* Accessibilité */}
      <SectionWithDivider visible={shouldShowAccessibility}>
        <AccordionItem
          title={t`Accessibilité`}
          scrollViewRef={scrollViewRef}
          onOpenOnce={() => analytics.logConsultAccessibility({ venueId })}>
          <AccessibilityBlock {...accessibility} />
        </AccordionItem>
      </SectionWithDivider>

      {/* Contact */}
      <SectionWithDivider visible={shouldShowContact}>
        <AccordionItem title={t`Contact`} scrollViewRef={scrollViewRef}>
          <ContactBlock venueId={venueId} />
        </AccordionItem>
      </SectionWithDivider>

      <SectionWithDivider visible>
        <Spacer.Column numberOfSpaces={6} />
      </SectionWithDivider>
    </Container>
  )
}

const LocationPointer = styled(DefaultLocationPointer).attrs(({ theme }) => ({
  color: theme.colors.primary,
  size: theme.icons.sizes.extraSmall,
}))``

const scrollIndicatorInsets = { right: 1 }

const Container = styled.ScrollView({ overflow: 'visible' })
const HiddenTitle = webStyled(Dt)({ display: 'none' })
const VenueTitle = webStyled(Dd)(({ theme }) => ({
  ...theme.typography.title3,
  textAlign: 'center',
}))

const MarginContainer = styled.View({
  marginHorizontal: getSpacing(6),
})

const VenueAddressContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: getSpacing(2),
})

const IconContainer = webStyled(Dt)({
  marginRight: getSpacing(1),
})

const StyledText = webStyled(Dd)(({ theme }) => ({
  ...theme.typography.caption,
  flexShrink: 1,
  textTransform: 'capitalize',
}))
