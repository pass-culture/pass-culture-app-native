import React from 'react'
import styled from 'styled-components/native'

import { TrendBlock, TrendNavigationProps } from 'features/home/types'
import { useFontScaleValue } from 'shared/accessibility/useFontScaleValue'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Typo, getSpacing } from 'ui/theme'

type TrendProps = TrendBlock &
  TrendNavigationProps & {
    moduleId: string
  }

const DESKTOP_BUTTON_SIZE = getSpacing(20)
const MOBILE_BUTTON_SIZE = getSpacing(14)

export const Trend = ({ image, title, ...rest }: TrendProps) => {
  const numberOfLines = useFontScaleValue<number>({ default: 2, at200PercentZoom: 3 })

  return (
    <Item key={title} accessibilityLabel={title} {...rest}>
      <ItemIcon source={image} />
      <StyledText numberOfLines={numberOfLines}>{title}</StyledText>
    </Item>
  )
}

const Item = styled(InternalTouchableLink)(({ theme }) => ({
  gap: theme.designSystem.size.spacing.s,
  padding: theme.isDesktopViewport ? theme.designSystem.size.spacing.s : getSpacing(0.75),
  alignItems: 'center',
}))

const StyledText = styled(Typo.BodyAccentXs)(({ theme }) => ({
  textAlign: 'center',
  width: theme.isDesktopViewport ? getSpacing(29) : getSpacing(19),
}))

const ItemIcon = styled.Image<{ source: { uri?: string; testUri?: string } }>(({ theme }) => ({
  width: theme.isDesktopViewport ? DESKTOP_BUTTON_SIZE : MOBILE_BUTTON_SIZE,
  height: theme.isDesktopViewport ? DESKTOP_BUTTON_SIZE : MOBILE_BUTTON_SIZE,
}))
