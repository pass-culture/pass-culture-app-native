import { useRef } from 'react'
import { Animated } from 'react-native'

import { getSpacing } from 'ui/theme'

export const HEIGHT_END_OF_TRANSITION = getSpacing(20)

const interpolationConfig: Animated.InterpolationConfigType = {
  inputRange: [0, HEIGHT_END_OF_TRANSITION],
  outputRange: [0, 1],
  extrapolate: 'clamp',
}

export function useScrollToBottomOpacity() {
  const listScrollAnimatedValue = useRef(new Animated.Value(0)).current

  const handleScroll = Animated.event([{ scrollOffset: listScrollAnimatedValue }], {
    useNativeDriver: true,
  })

  return { handleScroll, opacity: listScrollAnimatedValue.interpolate(interpolationConfig) }
}
