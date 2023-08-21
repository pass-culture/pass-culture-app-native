import { useRef } from 'react'
import { Animated, NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

import { getSpacing } from 'ui/theme'

const HEIGHT_END_OF_TRANSITION = getSpacing(20)
const MOBILE_HEADER_HEIGHT = getSpacing(70)

const interpolationConfig: Animated.InterpolationConfigType = {
  inputRange: [0, HEIGHT_END_OF_TRANSITION],
  outputRange: [0, 1],
  extrapolate: 'clamp',
}

const viewTranslationInterpolationConfig: Animated.InterpolationConfigType = {
  inputRange: [0, MOBILE_HEADER_HEIGHT],
  outputRange: [0, -MOBILE_HEADER_HEIGHT],
  extrapolate: 'clamp',
}

const gradientTranslationInterpolationConfig: Animated.InterpolationConfigType = {
  inputRange: [-MOBILE_HEADER_HEIGHT, 0],
  outputRange: [MOBILE_HEADER_HEIGHT, 0],
  extrapolate: 'clamp',
}

const imageHeightInterpolationConfig: Animated.InterpolationConfigType = {
  inputRange: [-MOBILE_HEADER_HEIGHT, 0],
  outputRange: [MOBILE_HEADER_HEIGHT * 2, MOBILE_HEADER_HEIGHT],
  extrapolate: 'clamp',
}

interface Props {
  listener?: ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => void
}

export const useOpacityTransition = ({ listener }: Props = {}) => {
  const headerScroll = useRef(new Animated.Value(0)).current

  const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y: headerScroll } } }], {
    useNativeDriver: false,
    listener,
  })

  const headerTransition = headerScroll.interpolate(interpolationConfig)
  const imageAnimatedHeight = headerScroll.interpolate(imageHeightInterpolationConfig)
  const gradientTranslation = headerScroll.interpolate(gradientTranslationInterpolationConfig)
  const viewTranslation = headerScroll.interpolate(viewTranslationInterpolationConfig)

  return {
    headerTransition,
    imageAnimatedHeight,
    gradientTranslation,
    viewTranslation,
    onScroll,
  }
}
