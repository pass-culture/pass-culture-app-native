import colorAlpha from 'color-alpha'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { BicolorLogo } from 'ui/svg/icons/BicolorLogo'
import { AccessibleBicolorIcon } from 'ui/svg/icons/types'
import { Spacer, getSpacing } from 'ui/theme'

interface Props {
  isSelected?: boolean
  BicolorIcon: React.FC<AccessibleBicolorIcon>
}

export const TabBarInnerComponentV2: React.FC<Props> = ({ isSelected, BicolorIcon }) => (
  <React.Fragment>
    {isSelected ? <Gradient /> : null}
    <Spacer.Flex />
    <StyledIcon as={BicolorIcon} selected={isSelected} />
    <Spacer.Flex />
    {isSelected ? <BicolorSelectorPlaceholder /> : null}
  </React.Fragment>
)

const GRADIENT_HEIGHT = getSpacing(0.5)

const Gradient = styled(LinearGradient).attrs(({ theme }) => ({
  colors: [
    colorAlpha(theme.colors.primary, 0),
    theme.colors.primary,
    theme.colors.secondary,
    colorAlpha(theme.colors.secondary, 0),
  ],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 },
}))({ height: GRADIENT_HEIGHT, width: '100%' })

const StyledIcon = styled(BicolorLogo).attrs<{ selected?: boolean }>(({ theme, selected }) => ({
  color: selected ? undefined : theme.colors.black,
  opacity: selected ? undefined : 0.5,
  size: theme.icons.sizes.small,
  thin: true,
}))<{ selected?: boolean }>``

const BicolorSelectorPlaceholder = styled.View({ height: GRADIENT_HEIGHT })
