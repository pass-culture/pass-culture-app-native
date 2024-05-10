import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import { IOScrollView as IntersectionObserverScrollView } from 'react-native-intersection-observer'
import styled, { useTheme } from 'styled-components/native'

import { VenueResponse, VenueTypeCodeKey } from 'api/gen'
import { GtlPlaylistData } from 'features/gtlPlaylist/types'
import type { VenueOffers as VenueOffersType } from 'features/venue/api/useVenueOffers'
import { PracticalInformation } from 'features/venue/components/PracticalInformation/PracticalInformation'
import { TabLayout } from 'features/venue/components/TabLayout/TabLayout'
import { VenueBanner } from 'features/venue/components/VenueBody/VenueBanner'
import { VENUE_CTA_HEIGHT_IN_SPACES } from 'features/venue/components/VenueCTA/VenueCTA'
import { VenueMessagingApps } from 'features/venue/components/VenueMessagingApps/VenueMessagingApps'
import { VenueOffers } from 'features/venue/components/VenueOffers/VenueOffers'
import { VenueThematicSection } from 'features/venue/components/VenueThematicSection/VenueThematicSection'
import { formatFullAddress } from 'libs/address/useFormatFullAddress'
import { analytics } from 'libs/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { SeeItineraryButton } from 'libs/itinerary/components/SeeItineraryButton'
import { getGoogleMapsItineraryUrl } from 'libs/itinerary/openGoogleMapsItinerary'
import { useDistance } from 'libs/location/hooks/useDistance'
import { MAP_VENUE_TYPE_TO_LABEL } from 'libs/parsers/venueType'
import { CopyToClipboardButton } from 'shared/CopyToClipboardButton/CopyToClipboardButton'
import { useGetHeaderHeight } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { Separator } from 'ui/components/Separator'
import { InformationTags } from 'ui/InformationTags/InformationTags'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

import { OpeningHoursStatus } from '../OpeningHoursStatus/OpeningHoursStatus'

interface Props {
  venue: VenueResponse
  onScroll: () => void
  venueOffers?: VenueOffersType
  playlists?: GtlPlaylistData[]
  shouldDisplayCTA?: boolean
}

export const VenueBody: FunctionComponent<Props> = ({
  venue,
  onScroll,
  venueOffers,
  playlists,
  shouldDisplayCTA,
}) => {
  const { bannerUrl, publicName, name, address, postalCode, city, bannerMeta } = venue
  const { isDesktopViewport, isTabletViewport } = useTheme()
  const headerHeight = useGetHeaderHeight()
  const isLargeScreen = isDesktopViewport || isTabletViewport

  const venueFullAddress = formatFullAddress(address, postalCode, city)
  const venueName = publicName || name

  const distanceToVenue = useDistance({ lat: venue.latitude, lng: venue.longitude })
  const venueTypeLabel =
    venue.venueTypeCode && venue.venueTypeCode !== VenueTypeCodeKey.ADMINISTRATIVE
      ? MAP_VENUE_TYPE_TO_LABEL[venue.venueTypeCode]
      : undefined

  const venueTags = []
  venueTypeLabel && venueTags.push(venueTypeLabel)
  distanceToVenue && venueTags.push(`À ${distanceToVenue}`)

  const FirstSectionContainer = isLargeScreen ? View : SectionWithDivider
  const hasGoogleCredit = bannerMeta?.is_from_google && bannerMeta?.image_credit

  const currentDate = new Date()
  const isDynamicOpeningHoursEnabled = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_ENABLE_DYNAMIC_OPENING_HOURS
  )

  const isDynamicOpeningHoursDisplayed = isDynamicOpeningHoursEnabled && venue.openingHours

  return (
    <Container onScroll={onScroll} scrollEventThrottle={16} bounces={false}>
      {isLargeScreen ? <Placeholder height={headerHeight} /> : null}
      <TopContainer>
        <VenueBanner bannerUrl={bannerUrl} bannerMeta={bannerMeta} />
        <Spacer.Column numberOfSpaces={hasGoogleCredit ? 2 : 6} />
        <MarginContainer>
          <InformationTags tags={venueTags} />
          <Spacer.Column numberOfSpaces={4} />
          <VenueTitle
            accessibilityLabel={`Nom du lieu\u00a0: ${venueName}`}
            adjustsFontSizeToFit
            allowFontScaling={false}>
            {venueName}
          </VenueTitle>
          <Spacer.Column numberOfSpaces={2} />
          {isDynamicOpeningHoursDisplayed ? (
            <React.Fragment>
              <OpeningHoursStatus currentDate={currentDate} openingHours={venue.openingHours} />
              <Spacer.Column numberOfSpaces={2} />
            </React.Fragment>
          ) : null}
          <Typo.Caption>Adresse</Typo.Caption>
          <Spacer.Column numberOfSpaces={1} />
          <Typo.Body>{venueFullAddress}</Typo.Body>
          <Spacer.Column numberOfSpaces={3} />
          <Separator.Horizontal />
          <Spacer.Column numberOfSpaces={3} />
          <CopyToClipboardButton
            wording="Copier l’adresse"
            textToCopy={`${venueName}, ${venueFullAddress}`}
            onCopy={() => analytics.logCopyAddress({ venueId: venue.id, from: 'venue' })}
            snackBarMessage="L’adresse a bien été copiée."
          />
          <Spacer.Column numberOfSpaces={3} />
          <SeeItineraryButton
            externalNav={{
              url: getGoogleMapsItineraryUrl(venueFullAddress),
              address: venueFullAddress,
            }}
            onPress={() => analytics.logConsultItinerary({ venueId: venue.id, from: 'venue' })}
          />
        </MarginContainer>
      </TopContainer>

      <Spacer.Column numberOfSpaces={isDesktopViewport ? 10 : 6} />

      <FirstSectionContainer visible gap={6}>
        <TabLayout
          tabPanels={{
            'Offres disponibles': (
              <VenueOffers venue={venue} venueOffers={venueOffers} playlists={playlists} />
            ),
            'Infos pratiques': <PracticalInformation venue={venue} />,
          }}
          onTabChange={{
            'Offres disponibles': () =>
              analytics.logConsultVenueOffers({
                venueId: venue.id,
              }),
            'Infos pratiques': () =>
              analytics.logConsultPracticalInformations({
                venueId: venue.id,
              }),
          }}
        />
      </FirstSectionContainer>

      <Spacer.Column numberOfSpaces={6} />

      <VenueThematicSection venue={venue} />

      <SectionWithDivider visible margin gap={6}>
        <VenueMessagingApps venue={venue} />
        <Spacer.Column numberOfSpaces={4} />
      </SectionWithDivider>

      <SectionWithDivider visible={!!shouldDisplayCTA} gap={VENUE_CTA_HEIGHT_IN_SPACES}>
        <Spacer.Column numberOfSpaces={6} />
      </SectionWithDivider>
    </Container>
  )
}

const Container = styled(IntersectionObserverScrollView).attrs({
  scrollIndicatorInsets: { right: 1 },
})({
  overflow: 'visible',
})

const TopContainer = styled.View(({ theme }) => {
  const isLargeScreen = theme.isDesktopViewport || theme.isTabletViewport
  return {
    flexDirection: isLargeScreen ? 'row' : 'column',
    marginTop: isLargeScreen ? getSpacing(8) : 0,
    marginHorizontal: isLargeScreen ? getSpacing(18) : 0,
  }
})

const VenueTitle = styled(Typo.Title3).attrs(getHeadingAttrs(1))``

const MarginContainer = styled.View({
  marginHorizontal: getSpacing(6),
  flexShrink: 1,
})

const Placeholder = styled.View<{ height: number }>(({ height }) => ({
  height,
}))
