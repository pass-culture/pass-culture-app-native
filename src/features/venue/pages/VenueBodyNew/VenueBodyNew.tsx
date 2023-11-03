import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { useVenue } from 'features/venue/api/useVenue'
import { Image } from 'libs/resizing-image-on-demand/Image'
import { useHeroDimensions } from 'ui/components/hero/useHeroDimensions'
import { VenueHeaderBackground } from 'ui/svg/VenueHeaderBackground'

interface Props {
  venueId: number
}

export const VenueBodyNew: FunctionComponent<Props> = ({ venueId }) => {
  const { data: venue } = useVenue(venueId)
  const { appContentWidth } = useTheme()
  const { heroBackgroundHeight: backgroundHeight } = useHeroDimensions('venue', !!venue?.bannerUrl)

  if (!venue) return <React.Fragment />

  const { bannerUrl } = venue
  const imageStyle = { height: backgroundHeight, width: appContentWidth }

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
    </Container>
  )
}

const Container = styled.ScrollView({ overflow: 'visible' })

const BackgroundContainer = styled.View({
  flexDirection: 'row',
})
