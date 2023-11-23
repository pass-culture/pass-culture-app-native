import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { VenueResponse } from 'api/gen'
import { TabLayout } from 'features/venue/components/TabLayout/TabLayout'
import { VenueOffersNew } from 'features/venue/components/VenueOffers/VenueOffersNew'
import { useVenueBackgroundStyle } from 'features/venue/helpers/useVenueBackgroundStyle'
import { formatFullAddress } from 'libs/address/useFormatFullAddress'
import { SeeItineraryButton } from 'libs/itinerary/components/SeeItineraryButton'
import { getGoogleMapsItineraryUrl } from 'libs/itinerary/openGoogleMapsItinerary'
import { Image } from 'libs/resizing-image-on-demand/Image'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { styledButton } from 'ui/components/buttons/styledButton'
import { useGetHeaderHeight } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { Separator } from 'ui/components/Separator'
import { Duplicate } from 'ui/svg/icons/Duplicate'
import { VenueHeaderBackground } from 'ui/svg/VenueHeaderBackground'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface Props {
  venue: VenueResponse
  onScroll: () => void
}

export const VenueBodyNew: FunctionComponent<Props> = ({ venue, onScroll }) => {
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
            //TODO(PC-25598) Check if we want that behaviour when bannerUrl is missing
            <BackgroundContainer>
              {Array.from({ length: 9 }).map((_, index) => (
                <VenueHeaderBackground key={index} />
              ))}
            </BackgroundContainer>
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
          <StyledButtonTertiary icon={Duplicate} wording="Copier l’adresse" />
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
            'Offres disponibles': <VenueOffersNew venueId={venue.id} />,
            'Infos pratiques': <Typo.Body>Panel des offres disponibles</Typo.Body>,
          }}
        />
      </FirstSectionContainer>

      <Spacer.Column numberOfSpaces={100} />
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

const BackgroundContainer = styled.View({
  flexDirection: 'row',
})

const HeaderContainer = styled.View({
  alignItems: 'center',
})

const StyledButtonTertiary = styledButton(ButtonTertiaryBlack)({
  justifyContent: 'flex-start',
})

const VenueTitle = styled(Typo.Title3).attrs(getHeadingAttrs(1))``

const MarginContainer = styled.View({
  marginHorizontal: getSpacing(6),
  flexShrink: 1,
})

const Placeholder = styled.View<{ height: number }>(({ height }) => ({
  height,
}))
