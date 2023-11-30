import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { VenueResponse } from 'api/gen'
import { GTLPlaylistResponse } from 'features/gtlPlaylist/api/gtlPlaylistApi'
import { PracticalInformation } from 'features/venue/components/PracticalInformation'
import { TabLayout } from 'features/venue/components/TabLayout/TabLayout'
import { VenueBanner } from 'features/venue/components/VenueBodyNew/VenueBanner'
import { VenueMessagingApps } from 'features/venue/components/VenueMessagingAppsNew/VenueMessagingAppsNew'
import { VenueOffersNew } from 'features/venue/components/VenueOffers/VenueOffersNew'
import { formatFullAddress } from 'libs/address/useFormatFullAddress'
import { SeeItineraryButton } from 'libs/itinerary/components/SeeItineraryButton'
import { getGoogleMapsItineraryUrl } from 'libs/itinerary/openGoogleMapsItinerary'
import { CopyToClipboardButton } from 'shared/CopyToClipboardButton/CopyToClipboardButton'
import { Offer } from 'shared/offer/types'
import { useGetHeaderHeight } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { Separator } from 'ui/components/Separator'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface Props {
  venue: VenueResponse
  onScroll: () => void
  venueOffers?: { hits: Offer[]; nbHits: number }
  playlists?: GTLPlaylistResponse
}

export const VenueBodyNew: FunctionComponent<Props> = ({
  venue,
  onScroll,
  venueOffers,
  playlists,
}) => {
  const { bannerUrl, publicName, name, address, postalCode, city } = venue
  const { isDesktopViewport, isTabletViewport } = useTheme()
  const headerHeight = useGetHeaderHeight()
  const isLargeScreen = isDesktopViewport || isTabletViewport

  const venueFullAddress = formatFullAddress(address, postalCode, city)
  const venueName = publicName || name

  const FirstSectionContainer = isLargeScreen ? MarginContainer : SectionWithDivider

  return (
    <Container onScroll={onScroll} scrollEventThrottle={16} bounces={false}>
      {isLargeScreen ? <Placeholder height={headerHeight} /> : null}
      <TopContainer>
        <VenueBanner bannerUrl={bannerUrl} />
        <Spacer.Column numberOfSpaces={6} />
        <MarginContainer>
          <VenueTitle
            accessibilityLabel={`Nom du lieu\u00a0: ${venueName}`}
            adjustsFontSizeToFit
            allowFontScaling={false}>
            {venueName}
          </VenueTitle>
          <Spacer.Column numberOfSpaces={2} />
          <Typo.Caption>Adresse</Typo.Caption>
          <Spacer.Column numberOfSpaces={1} />
          <Typo.Body>{venueFullAddress}</Typo.Body>
          <Spacer.Column numberOfSpaces={3} />
          <Separator.Horizontal />
          <Spacer.Column numberOfSpaces={3} />
          <CopyToClipboardButton
            wording="Copier l’adresse"
            textToCopy={`${venueName}, ${venueFullAddress}`}
            snackBarMessage="L’adresse a bien été copiée"
          />
          <Spacer.Column numberOfSpaces={3} />
          <SeeItineraryButton
            externalNav={{
              url: getGoogleMapsItineraryUrl(venueFullAddress),
              address: venueFullAddress,
            }}
          />
        </MarginContainer>
      </TopContainer>

      <Spacer.Column numberOfSpaces={6} />

      <FirstSectionContainer visible>
        <TabLayout
          tabPanels={{
            'Offres disponibles': (
              <VenueOffersNew venue={venue} venueOffers={venueOffers} playlists={playlists} />
            ),
            'Infos pratiques': <PracticalInformation venue={venue} />,
          }}
        />
      </FirstSectionContainer>

      <Spacer.Column numberOfSpaces={6} />

      <SectionWithDivider visible>
        <MarginContainer>
          <VenueMessagingApps venueId={venue.id} />
        </MarginContainer>
      </SectionWithDivider>
    </Container>
  )
}

const Container = styled.ScrollView({ overflow: 'visible' })

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
