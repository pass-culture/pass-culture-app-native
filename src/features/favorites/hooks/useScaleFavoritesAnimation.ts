import { useEffect, useRef } from 'react'
import { Animated } from 'react-native'

import { ANIMATION_USE_NATIVE_DRIVER } from 'ui/components/animationUseNativeDriver'

export const useScaleAnimation = (nbFavorites?: number) => {
  const scaleAnimation = useRef(new Animated.Value(1))

  useEffect(() => {
    if (typeof nbFavorites === 'number') {
      Animated.sequence([
        Animated.timing(scaleAnimation.current, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: ANIMATION_USE_NATIVE_DRIVER,
        }),
        Animated.timing(scaleAnimation.current, {
          toValue: 1,
          duration: 200,
          useNativeDriver: ANIMATION_USE_NATIVE_DRIVER,
        }),
      ]).start()
    }
  }, [nbFavorites])

  return scaleAnimation.current
}
