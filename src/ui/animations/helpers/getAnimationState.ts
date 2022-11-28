import { Animated, Easing } from 'react-native'
import { DefaultTheme } from 'styled-components/native'

const iconBackgroundInterpolation = (theme: DefaultTheme) => ({
  inputRange: [0, 1],
  outputRange: [theme.colors.white, 'rgba(255, 255, 255, 0)'],
  easing: Easing.bezier(0, 0.75, 0, 0.75),
})

const iconBorderInterpolation = (theme: DefaultTheme) => ({
  inputRange: [0, 1],
  outputRange: [theme.colors.greyLight, 'rgba(255, 255, 255, 0)'],
  easing: Easing.bezier(0, 1, 0, 1),
})

const headerBackgroundInterpolation = (theme: DefaultTheme) => ({
  inputRange: [0, 1],
  outputRange: ['rgba(255, 255, 255, 0)', theme.colors.primary],
})

export const getAnimationState = (
  theme: DefaultTheme,
  headerTransition: Animated.AnimatedInterpolation
) => ({
  animationState: {
    iconBackgroundColor: headerTransition.interpolate(iconBackgroundInterpolation(theme)),
    iconBorderColor: headerTransition.interpolate(iconBorderInterpolation(theme)),
    transition: headerTransition,
  },
  backgroundColor: headerTransition.interpolate(headerBackgroundInterpolation(theme)),
})
