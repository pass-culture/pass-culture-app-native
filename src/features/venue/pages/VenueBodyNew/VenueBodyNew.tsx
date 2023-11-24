import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { VenueResponse } from 'api/gen'
import { GTLPlaylistResponse } from 'features/gtlPlaylist/api/gtlPlaylistApi'
import { PracticalInformation } from 'features/venue/components/PracticalInformation'
import { TabLayout } from 'features/venue/components/TabLayout/TabLayout'
import { VenueOffersNew } from 'features/venue/components/VenueOffers/VenueOffersNew'
import { useVenueBackgroundStyle } from 'features/venue/helpers/useVenueBackgroundStyle'
import { formatFullAddress } from 'libs/address/useFormatFullAddress'
import { SeeItineraryButton } from 'libs/itinerary/components/SeeItineraryButton'
import { getGoogleMapsItineraryUrl } from 'libs/itinerary/openGoogleMapsItinerary'
import { Image } from 'libs/resizing-image-on-demand/Image'
import { CopyToClipboardButton } from 'shared/CopyToClipboardButton/CopyToClipboardButton'
import { useGetHeaderHeight } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { Separator } from 'ui/components/Separator'
import { Venue } from 'ui/svg/icons/Venue'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface Props {
  venue: VenueResponse
  onScroll: () => void
  playlists?: GTLPlaylistResponse
}

export const VenueBodyNew: FunctionComponent<Props> = ({ venue, onScroll, playlists }) => {
  const { bannerUrl, publicName, name, address, postalCode, city } = venue
  const backgroundStyle = useVenueBackgroundStyle()
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
        <HeaderContainer>
          {bannerUrl ? (
            <Image style={backgroundStyle} resizeMode="cover" url={bannerUrl} />
          ) : (
            <EmptyVenueBackground style={backgroundStyle} testID="defaultVenueBackground">
              <Spacer.TopScreen />
              <VenueIcon />
            </EmptyVenueBackground>
          )}
        </HeaderContainer>
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
            'Offres disponibles': <VenueOffersNew venueId={venue.id} playlists={playlists} />,
            'Infos pratiques': <PracticalInformation venue={venue} />,
          }}
        />
      </FirstSectionContainer>
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

const EmptyVenueBackground = styled.View(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.colors.greyLight,
}))

const VenueIcon = styled(Venue).attrs(({ theme }) => ({
  size: getSpacing(30),
  color: theme.colors.greyMedium,
}))``

const HeaderContainer = styled.View({
  alignItems: 'center',
})

const VenueTitle = styled(Typo.Title3).attrs(getHeadingAttrs(1))``

const MarginContainer = styled.View({
  marginHorizontal: getSpacing(6),
  flexShrink: 1,
})

const Placeholder = styled.View<{ height: number }>(({ height }) => ({
  height,
}))
