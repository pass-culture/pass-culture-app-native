import React from 'react'
import { useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { TrendBlock } from 'features/home/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { getSpacing, Typo } from 'ui/theme'

type Trends = {
  moduleId: string
  items: TrendBlock[]
}

const DESKTOP_BUTTON_SIZE = getSpacing(20)
const MOBILE_BUTTON_SIZE = getSpacing(14)

export const TrendsModule = ({ items }: Trends) => {
  const { width } = useWindowDimensions()
  const isSmallScreen = width < 375

  return (
    <Container isSmallScreen={isSmallScreen}>
      {items.map(({ image, title }) => (
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
    paddingBottom: theme.home.spaceBetweenModules,
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
