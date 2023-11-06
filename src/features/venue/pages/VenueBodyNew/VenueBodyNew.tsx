import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { VenueResponse } from 'api/gen'
import { TabLayout } from 'features/venue/components/TabLayout'
import { formatFullAddress } from 'libs/address/useFormatFullAddress'
import { SeeItineraryButton } from 'libs/itinerary/components/SeeItineraryButton'
import { getGoogleMapsItineraryUrl } from 'libs/itinerary/openGoogleMapsItinerary'
import { Image } from 'libs/resizing-image-on-demand/Image'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { styledButton } from 'ui/components/buttons/styledButton'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { Separator } from 'ui/components/Separator'
import { Duplicate } from 'ui/svg/icons/Duplicate'
import { VenueHeaderBackground } from 'ui/svg/VenueHeaderBackground'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

interface Props {
  venue: VenueResponse
  onScroll: () => void
}

const FLAT_BACKGROUND_HEIGHT = getSpacing(43)

export const VenueBodyNew: FunctionComponent<Props> = ({ venue, onScroll }) => {
  const { publicName, name, address, postalCode, city } = venue

  const bannerUrl = undefined

  const { appContentWidth } = useTheme()
  const { top } = useCustomSafeInsets()
  const backgroundHeight = top + FLAT_BACKGROUND_HEIGHT
  const backgroundStyle = { height: backgroundHeight, width: appContentWidth }

  const venueFullAddress = formatFullAddress(address, postalCode, city)
  const venueName = publicName || name

  return (
    <Container onScroll={onScroll} scrollEventThrottle={16} bounces={false}>
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
          numberOfLines={2}
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
      <Spacer.Column numberOfSpaces={6} />

      <SectionWithDivider visible>
        <TabLayout />
      </SectionWithDivider>

      <Spacer.Column numberOfSpaces={100} />
    </Container>
  )
}

const Container = styled.ScrollView({ overflow: 'visible' })

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
})
