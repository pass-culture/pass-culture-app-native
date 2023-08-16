import React, { FunctionComponent } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { Color } from 'features/home/types'
import { theme } from 'theme'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { getSpacing, Typo } from 'ui/theme'
import { gradientColorsMapping } from 'ui/theme/gradientColorsMapping'


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
        <StyledTitle numberOfLines={2}>{title}</StyledTitle>
    </ColoredContainer>
  </StyledInternalTouchableLink>
)

const ColoredContainer = styled(LinearGradient).attrs({
  start: { x: 0, y: 0 },
  end: { x: 0, y: 1 },
})(({ theme }) => ({
  flex: 1,
  borderRadius: theme.borderRadius.radius,
}))

const StyledTitle = styled(Typo.ButtonText)({
  color: theme.colors.white,
  paddingVertical: getSpacing(4),
  paddingHorizontal: getSpacing(3),
})

const StyledInternalTouchableLink = styled(InternalTouchableLink).attrs(({ theme }) => ({
  hoverUnderlineColor: theme.colors.white,
}))({
  height: getSpacing(18),
})
