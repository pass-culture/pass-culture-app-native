import React, { FC } from 'react'
import { useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { getSpacing, Typo } from 'ui/theme'

import FreeImage from '../../images/free.png'
import MapImage from '../../images/map.png'
import RecosImage from '../../images/recos.png'
import WeekendImage from '../../images/weekend.png'

const BUTTONS = [
  { title: 'À coté', image: MapImage },
  { title: 'Les recos', image: RecosImage },
  { title: 'Ce week-end', image: WeekendImage },
  { title: 'Gratuit', image: FreeImage },
]

const DESKTOP_BUTTON_SIZE = getSpacing(20)
const MOBILE_BUTTON_SIZE = getSpacing(14)

export const TrendsModule: FC = () => {
  const { width } = useWindowDimensions()
  const isSmallScreen = width < 375

  return (
    <Container isSmallScreen={isSmallScreen}>
      {BUTTONS.map(({ image, title }) => (
        <Item key={title}>
          <ItemIcon source={image} />
          <StyledText>{title}</StyledText>
        </Item>
      ))}
    </Container>
  )
}

const Container = styled.View<{ isSmallScreen: boolean }>(({ isSmallScreen, theme }) => {
  const mobileGap = isSmallScreen ? getSpacing(1) : getSpacing(2)
  return {
    flexDirection: 'row',
    gap: theme.isDesktopViewport ? getSpacing(4) : mobileGap,
    justifyContent: 'center',
  }
})

const Item = styledButton(Touchable)(({ theme }) => ({
  gap: getSpacing(2),
  padding: theme.isDesktopViewport ? getSpacing(1.5) : getSpacing(0.75),
  alignItems: 'center',
}))

const StyledText = styled(Typo.Caption).attrs({
  numberOfLines: 2,
})(({ theme }) => ({
  textAlign: 'center',
  width: theme.isDesktopViewport ? getSpacing(29) : getSpacing(19),
}))

const ItemIcon = styled.Image(({ theme }) => ({
  width: theme.isDesktopViewport ? DESKTOP_BUTTON_SIZE : MOBILE_BUTTON_SIZE,
  height: theme.isDesktopViewport ? DESKTOP_BUTTON_SIZE : MOBILE_BUTTON_SIZE,
}))
