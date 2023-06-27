import colorAlpha from 'color-alpha'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { theme } from 'theme'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { getSpacing, Typo } from 'ui/theme'

interface FilterProps {
  color: string
  opacity: number
}

const title = 'Afficher la carte'

export const MapBlock: FunctionComponent = () => (
  <StyledInternalTouchableLink navigateTo={{ screen: 'Dora' }}>
    <ImageBackground source={require('/Users/tanguy/Documents/pass-culture-app-native/assets/images/Carte.png')}>
      <ContainerWithFilter filter={{ color: theme.colors.black, opacity: 0.2 }}>
        <StyledTitle numberOfLines={2}>{title}</StyledTitle>
      </ContainerWithFilter>
    </ImageBackground>
  </StyledInternalTouchableLink>
)

const ContainerWithFilter = styled.View<{ filter: FilterProps }>(({ filter }) => ({
  paddingVertical: getSpacing(4),
  paddingHorizontal: getSpacing(3),
  backgroundColor: colorAlpha(filter.color, filter.opacity),
  flex: 1,
  borderRadius: theme.borderRadius.radius,
  justifyContent: 'flex-end'
}))

const StyledTitle = styled(Typo.ButtonText)({
  color: theme.colors.white,
})

const ImageBackground = styled.ImageBackground({
  //the overflow: hidden allow to add border radius to the image
  //https://stackoverflow.com/questions/49442165/how-do-you-add-borderradius-to-imagebackground/57616397
  overflow: 'hidden',
  borderRadius: theme.borderRadius.radius,
  flex: 1,
})

const StyledInternalTouchableLink = styled(InternalTouchableLink).attrs(({ theme }) => ({
  hoverUnderlineColor: theme.colors.white,
}))({
  height: getSpacing(18),
  marginHorizontal: getSpacing(6),
})
