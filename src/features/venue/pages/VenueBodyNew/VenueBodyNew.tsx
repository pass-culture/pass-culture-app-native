import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { useVenue } from 'features/venue/api/useVenue'
import { formatFullAddress } from 'libs/address/useFormatFullAddress'
import { Image } from 'libs/resizing-image-on-demand/Image'
import { useHeroDimensions } from 'ui/components/hero/useHeroDimensions'
import { VenueHeaderBackground } from 'ui/svg/VenueHeaderBackground'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface Props {
  venueId: number
}

export const VenueBodyNew: FunctionComponent<Props> = ({ venueId }) => {
  const { data: venue } = useVenue(venueId)
  const { appContentWidth } = useTheme()
  const { heroBackgroundHeight: backgroundHeight } = useHeroDimensions('venue', !!venue?.bannerUrl)

  if (!venue) return <React.Fragment />

  const { bannerUrl, publicName, name, address, postalCode, city } = venue
  const imageStyle = { height: backgroundHeight, width: appContentWidth }

  const venueFullAddress = venue.address ? formatFullAddress(address, postalCode, city) : undefined

  return (
    <Container>
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
      </MarginContainer>
    </Container>
  )
}

const Container = styled.ScrollView({ overflow: 'visible' })

const BackgroundContainer = styled.View({
  flexDirection: 'row',
})

const VenueTitle = styled(Typo.Title3).attrs(getHeadingAttrs(1))``

const MarginContainer = styled.View({
  marginHorizontal: getSpacing(6),
})
