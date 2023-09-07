import { Animated, Easing, Platform } from 'react-native'
import { DefaultTheme } from 'styled-components/native'

const blurHeaderWebInterpolation = () => ({
  inputRange: [0, 1],
  outputRange: ['blur(0px)', 'blur(20px)'],
})

const iconBackgroundInterpolation = (theme: DefaultTheme) => ({
  inputRange: [0, 1],
  outputRange: [theme.colors.white, 'rgba(255, 255, 255, 0)'],
})

const strokeBorderInterpolation = () => ({
  inputRange: [0, 0.8, 1],
  outputRange: [0, 0, 1],
})

const iconBorderInterpolation = (theme: DefaultTheme) => ({
  inputRange: [0, 1],
  outputRange: [theme.colors.greyLight, 'rgba(255, 255, 255, 0)'],
  easing: Easing.bezier(0, 1, 0, 1),
})

const headerBackgroundInterpolation = () => ({
  inputRange: [0, 1],
  outputRange: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.8)'],
})

const headerBackgroundAndroidInterpolation = () => ({
  inputRange: [0, 1],
  outputRange: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)'],
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
        ? headerTransition.interpolate(headerBackgroundAndroidInterpolation())
        : headerTransition.interpolate(headerBackgroundInterpolation()),
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
