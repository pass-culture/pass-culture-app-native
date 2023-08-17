import React, { FunctionComponent } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { Color } from 'features/home/types'
import { theme } from 'theme'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { getSpacing, Typo } from 'ui/theme'
import { gradientColorsMapping } from 'ui/theme/gradientColorsMapping'

import { Shape } from './Shape'

const BLOCK_HEIGHT = getSpacing(24)

interface CategoryBlockProps {
  title: string
  navigateTo: InternalNavigationProps['navigateTo']
  image?: string
  color: Color
  onBeforePress: () => void | Promise<void>
}

export const CategoryBlock: FunctionComponent<CategoryBlockProps> = ({
  title,
  navigateTo,
  color,
  onBeforePress,
}) => (
  <StyledInternalTouchableLink onBeforeNavigate={onBeforePress} navigateTo={navigateTo}>
    <ColoredContainer colors={gradientColorsMapping[color]}>
      <StyledShape color={color} height={BLOCK_HEIGHT} />
      <StyledTitle numberOfLines={2}>{title}</StyledTitle>
    </ColoredContainer>
  </StyledInternalTouchableLink>
)

const ColoredContainer = styled(LinearGradient).attrs({
  start: { x: 0, y: 0 },
  end: { x: 0, y: 1 },
})(({ theme }) => ({
  flex: 1,
  flexDirection: 'column-reverse',
  borderRadius: theme.borderRadius.radius,
}))

const StyledShape = styled(Shape)({ position: 'absolute', right: 0 })

const StyledTitle = styled(Typo.ButtonText)({
  color: theme.colors.white,
  paddingVertical: getSpacing(3),
  paddingHorizontal: getSpacing(3),
})

const StyledInternalTouchableLink = styled(InternalTouchableLink).attrs(({ theme }) => ({
  hoverUnderlineColor: theme.colors.white,
}))({
  height: BLOCK_HEIGHT,
})
