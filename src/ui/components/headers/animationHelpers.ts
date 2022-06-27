import { useRef } from 'react'
import { Animated, Easing, NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import { DefaultTheme } from 'styled-components/native'

import { getSpacing } from 'ui/theme'
const HEIGHT_END_OF_TRANSITION = getSpacing(20)

const interpolationConfig = {
  inputRange: [0, HEIGHT_END_OF_TRANSITION],
  outputRange: [0, 1],
  extrapolate: 'clamp' as Animated.ExtrapolateType,
}

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

interface Props {
  listener?: ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => void
}

export const useHeaderTransition = ({ listener }: Props = {}) => {
  const headerScroll = useRef(new Animated.Value(0)).current

  const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y: headerScroll } } }], {
    useNativeDriver: false,
    listener,
  })

  const headerTransition = headerScroll.interpolate(interpolationConfig)

  return { headerTransition, onScroll }
}
