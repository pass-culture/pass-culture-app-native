import { useRef } from 'react'
import { Animated, Easing, NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

import { getSpacing } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
const HEIGHT_END_OF_TRANSITION = getSpacing(20)

const interpolationConfig = {
  inputRange: [0, HEIGHT_END_OF_TRANSITION],
  outputRange: [0, 1],
  extrapolate: 'clamp' as Animated.ExtrapolateType,
}

const iconBackgroundInterpolation = {
  inputRange: [0, 1],
  outputRange: [ColorsEnum.WHITE, 'rgba(255, 255, 255, 0)'],
  easing: Easing.bezier(0, 0.75, 0, 0.75),
}

const iconBorderInterpolation = {
  inputRange: [0, 1],
  outputRange: [ColorsEnum.GREY_LIGHT, 'rgba(255, 255, 255, 0)'],
  easing: Easing.bezier(0, 1, 0, 1),
}

const headerBackgroundInterpolation = {
  inputRange: [0, 1],
  outputRange: ['rgba(255, 255, 255, 0)', ColorsEnum.PRIMARY],
}

export const getAnimationState = (headerTransition: Animated.AnimatedInterpolation) => ({
  animationState: {
    iconBackgroundColor: headerTransition.interpolate(iconBackgroundInterpolation),
    iconBorderColor: headerTransition.interpolate(iconBorderInterpolation),
    transition: headerTransition,
  },
  backgroundColor: headerTransition.interpolate(headerBackgroundInterpolation),
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
