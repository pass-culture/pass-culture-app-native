import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated'

export const useIconWiggle = () => {
  const rotation = useSharedValue(0)
  const iconAnimatedStyle = useAnimatedStyle(
    () => ({ transform: [{ rotate: `${rotation.value}deg` }] }),
    [rotation]
  )

  const trigger = () => {
    rotation.value = withSequence(
      withTiming(-12, { duration: 80, easing: Easing.out(Easing.quad) }),
      withTiming(12, { duration: 140, easing: Easing.inOut(Easing.quad) }),
      withTiming(-12, { duration: 140, easing: Easing.inOut(Easing.quad) }),
      withTiming(12, { duration: 140, easing: Easing.inOut(Easing.quad) }),
      withTiming(0, { duration: 80, easing: Easing.out(Easing.quad) })
    )
  }

  return { iconAnimatedStyle, trigger }
}
