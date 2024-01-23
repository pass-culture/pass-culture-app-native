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
const image = {
  uri: 'https://img.freepik.com/vecteurs-libre/carte-coloree-ville-rues-parc_23-2148318250.jpg?w=1480&t=st=1705708024~exp=1705708624~hmac=b1a56fbab0b621e58969d70fee0ffe8a817ce77947bedf5c7ff31dde6a3817ae',
}

export const MapBlock: FunctionComponent = () => (
  <StyledInternalTouchableLink navigateTo={{ screen: 'Dora' }}>
    <ImageBackground source={image}>
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
  justifyContent: 'flex-end',
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
