import { Animated, Easing } from 'react-native'

import { ColorsEnum, getSpacing } from 'ui/theme'

export const HEIGHT_END_OF_TRANSITION = getSpacing(20)

export const interpolationConfig = {
  inputRange: [0, HEIGHT_END_OF_TRANSITION],
  outputRange: [0, 1],
  extrapolate: 'clamp' as Animated.ExtrapolateType,
}

export const iconBackgroundInterpolation = {
  inputRange: [0, 1],
  outputRange: [ColorsEnum.WHITE, 'rgba(255, 255, 255, 0)'],
  easing: Easing.bezier(0, 0.75, 0, 0.75),
}

export const iconBorderInterpolation = {
  inputRange: [0, 1],
  outputRange: [ColorsEnum.GREY_LIGHT, 'rgba(255, 255, 255, 0)'],
  easing: Easing.bezier(0, 1, 0, 1),
}

export const headerBackgroundInterpolation = {
  inputRange: [0, 1],
  outputRange: ['rgba(255, 255, 255, 0)', ColorsEnum.PRIMARY],
}
