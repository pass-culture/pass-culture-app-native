import { useRef } from 'react'
import { Animated, NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

import { getSpacing } from 'ui/theme'

const HEIGHT_END_OF_TRANSITION = getSpacing(20)

const interpolationConfig = {
  inputRange: [0, HEIGHT_END_OF_TRANSITION],
  outputRange: [0, 1],
  extrapolate: 'clamp' as Animated.ExtrapolateType,
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

  return { headerTransition, onScroll }
}
