import React from 'react'
import styled from 'styled-components/native'

import { useVenueBackgroundStyle } from 'features/venue/helpers/useVenueBackgroundStyle'
import { Image } from 'libs/resizing-image-on-demand/Image'
import { Venue } from 'ui/svg/icons/Venue'
import { getSpacing, Spacer } from 'ui/theme'

type Props = {
  bannerUrl?: string | null
}

export const VenueBanner: React.FC<Props> = ({ bannerUrl }) => {
  const backgroundStyle = useVenueBackgroundStyle()

  return (
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
  )
}

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
