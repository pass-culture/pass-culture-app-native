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

const viewTranslationInterpolationConfig = (
  height: number = MOBILE_HEADER_HEIGHT
): Animated.InterpolationConfigType => ({
  inputRange: [0, height],
  outputRange: [0, -height],
  extrapolate: 'clamp',
})

const gradientTranslationInterpolationConfig = (
  height: number = MOBILE_HEADER_HEIGHT
): Animated.InterpolationConfigType => ({
  inputRange: [-height, 0],
  outputRange: [height, 0],
  extrapolate: 'clamp',
})

const imageHeightInterpolationConfig = (
  height: number = MOBILE_HEADER_HEIGHT
): Animated.InterpolationConfigType => ({
  inputRange: [-height, 0],
  outputRange: [height * 2, height],
  extrapolate: 'clamp',
})

interface Props {
  listener?: ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => void
  headerHeight?: number
}

export const useOpacityTransition = ({ listener, headerHeight }: Props = {}) => {
  const headerScroll = useRef(new Animated.Value(0)).current

  const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y: headerScroll } } }], {
    useNativeDriver: false,
    listener,
  })

  const height = headerHeight

  const headerTransition = headerScroll.interpolate(interpolationConfig)
  const imageAnimatedHeight = headerScroll.interpolate(imageHeightInterpolationConfig(height))
  const gradientTranslation = headerScroll.interpolate(
    gradientTranslationInterpolationConfig(height)
  )
  const viewTranslation = headerScroll.interpolate(viewTranslationInterpolationConfig(height))

  return {
    headerTransition,
    imageAnimatedHeight,
    gradientTranslation,
    viewTranslation,
    onScroll,
    headerHeight,
  }
}
