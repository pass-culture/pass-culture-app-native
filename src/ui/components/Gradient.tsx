import colorAlpha from 'color-alpha'
import LinearGradient from 'react-native-linear-gradient'
import { styled } from 'styled-components/native'

import { createAnimatableComponent } from 'libs/react-native-animatable'
import { getSpacing } from 'ui/theme'

const GRADIENT_HEIGHT = getSpacing(30)

const AnimatedGradient = createAnimatableComponent(LinearGradient)

export const Gradient = styled(AnimatedGradient).attrs<{
  colors?: string[]
  bottomViewHeight: number
}>(({ theme }) => ({
  colors: [
    colorAlpha(theme.designSystem.color.background.default, 0),
    theme.designSystem.color.background.default,
  ],
  locations: [0, 1],
  pointerEvents: 'none',
}))<{ bottomViewHeight: number }>(({ bottomViewHeight }) => ({
  position: 'absolute',
  height: GRADIENT_HEIGHT,
  left: 0,
  right: 0,
  bottom: bottomViewHeight,
}))
