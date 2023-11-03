import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { VenueResponse } from 'api/gen'
import { formatFullAddress } from 'libs/address/useFormatFullAddress'
import { SeeItineraryButton } from 'libs/itinerary/components/SeeItineraryButton'
import { getGoogleMapsItineraryUrl } from 'libs/itinerary/openGoogleMapsItinerary'
import { Image } from 'libs/resizing-image-on-demand/Image'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { styledButton } from 'ui/components/buttons/styledButton'
import { useHeroDimensions } from 'ui/components/hero/useHeroDimensions'
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

  const { appContentWidth } = useTheme()
  const { heroBackgroundHeight: backgroundHeight } = useHeroDimensions('venue', !!bannerUrl)
  const imageStyle = { height: backgroundHeight, width: appContentWidth }

  const venueFullAddress = formatFullAddress(address, postalCode, city)

  return (
    <Container onScroll={onScroll} scrollEventThrottle={20} bounces={false}>
      {bannerUrl ? (
        <Image style={imageStyle} resizeMode="cover" url={bannerUrl} />
      ) : (
        <BackgroundContainer>
          {Array.from({ length: 9 }).map((_, index) => (
            <VenueHeaderBackground key={index} />
          ))}
        </BackgroundContainer>
      )}
      <Spacer.Column numberOfSpaces={6} />
      <MarginContainer>
        <VenueTitle
          accessibilityLabel={`Nom du lieu\u00a0: ${publicName || name}`}
          numberOfLines={2}
          adjustsFontSizeToFit
          allowFontScaling={false}>
          {publicName || name}
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
      <Spacer.Column numberOfSpaces={100} />
    </Container>
  )
}

const Container = styled.ScrollView({ overflow: 'visible' })

const BackgroundContainer = styled.View({
  flexDirection: 'row',
})

const StyledButtonTertiary = styledButton(ButtonTertiaryBlack)({
  justifyContent: 'flex-start',
})

const VenueTitle = styled(Typo.Title3).attrs(getHeadingAttrs(1))``

const MarginContainer = styled.View({
  marginHorizontal: getSpacing(6),
})
