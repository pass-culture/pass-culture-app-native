import React from 'react'
import styled from 'styled-components/native'

import { TrendBlock, TrendNavigationProps } from 'features/home/types'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { getSpacing, Typo } from 'ui/theme'

type TrendProps = TrendBlock &
  TrendNavigationProps & {
    moduleId: string
  }

const DESKTOP_BUTTON_SIZE = getSpacing(20)
const MOBILE_BUTTON_SIZE = getSpacing(14)

export const Trend = ({ image, title, navigateTo, ...rest }: TrendProps) => {
  if (!navigateTo?.screen) return null

  return (
    <Item
      key={title}
      navigateTo={{ screen: navigateTo.screen, params: navigateTo.params }}
      {...rest}>
      <ItemIcon source={'testUri' in image ? { uri: image.testUri } : image} />
      <StyledText>{title}</StyledText>
    </Item>
  )
}

const Item = styled(InternalTouchableLink)(({ theme }) => ({
  gap: getSpacing(2),
  padding: theme.isDesktopViewport ? getSpacing(1.5) : getSpacing(0.75),
  alignItems: 'center',
}))

const StyledText = styled(Typo.BodyAccentXs).attrs({
  numberOfLines: 2,
})(({ theme }) => ({
  textAlign: 'center',
  width: theme.isDesktopViewport ? getSpacing(29) : getSpacing(19),
}))

const ItemIcon = styled.Image(({ theme }) => ({
  width: theme.isDesktopViewport ? DESKTOP_BUTTON_SIZE : MOBILE_BUTTON_SIZE,
  height: theme.isDesktopViewport ? DESKTOP_BUTTON_SIZE : MOBILE_BUTTON_SIZE,
}))
