import colorAlpha from 'color-alpha'
import { Animated, Easing, Platform } from 'react-native'
import { DefaultTheme } from 'styled-components/native'

const blurHeaderWebInterpolation = () => ({
  inputRange: [0, 1],
  outputRange: ['blur(0px)', 'blur(20px)'],
})

const iconBackgroundInterpolation = (theme: DefaultTheme) => ({
  inputRange: [0, 1],
  outputRange: [
    theme.designSystem.color.icon.inverted,
    colorAlpha(theme.designSystem.color.icon.inverted, 0),
  ],
})

const strokeBorderInterpolation = () => ({
  inputRange: [0, 0.8, 1],
  outputRange: [0, 0, 1],
})

const iconBorderInterpolation = (theme: DefaultTheme) => ({
  inputRange: [0, 1],
  outputRange: [
    theme.designSystem.color.border.inverted,
    colorAlpha(theme.designSystem.color.border.inverted, 0),
  ],
  easing: Easing.bezier(0, 1, 0, 1),
})

const headerBackgroundInterpolation = (theme: DefaultTheme) => ({
  inputRange: [0, 1],
  outputRange: [
    colorAlpha(theme.designSystem.color.icon.inverted, 0),
    colorAlpha(theme.designSystem.color.icon.inverted, 0.8),
  ],
})

const headerBackgroundAndroidInterpolation = (theme: DefaultTheme) => ({
  inputRange: [0, 1],
  outputRange: [
    colorAlpha(theme.designSystem.color.icon.inverted, 0),
    theme.designSystem.color.icon.inverted,
  ],
})

export const getAnimationState = (
  theme: DefaultTheme,
  headerTransition: Animated.AnimatedInterpolation<string | number>
) => ({
  animationState: {
    iconBackgroundColor: headerTransition.interpolate(iconBackgroundInterpolation(theme)),
    iconBorderColor: headerTransition.interpolate(iconBorderInterpolation(theme)),
    transition: headerTransition,
  },
  containerStyle: {
    // There is an issue with the blur on Android: we chose to render a white background for the header
    backgroundColor:
      Platform.OS === 'android'
        ? headerTransition.interpolate(headerBackgroundAndroidInterpolation(theme))
        : headerTransition.interpolate(headerBackgroundInterpolation(theme)),
    borderBottomWidth: headerTransition.interpolate(strokeBorderInterpolation()),
    backdropFilter: headerTransition.interpolate(blurHeaderWebInterpolation()),
    // This is necessary to make the blur work on Safari (usually added by styled-components)
    ...(Platform.OS === 'web'
      ? { WebkitBackdropFilter: headerTransition.interpolate(blurHeaderWebInterpolation()) }
      : {}),
  },
  blurContainerNative: {
    opacity: headerTransition,
  },
})
