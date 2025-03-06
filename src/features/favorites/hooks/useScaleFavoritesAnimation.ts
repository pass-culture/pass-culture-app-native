import { useRef, useEffect } from 'react'
import { Animated } from 'react-native'

export const useScaleAnimation = (nbFavorites?: number) => {
  const scaleAnimation = useRef(new Animated.Value(1))

  useEffect(() => {
    if (typeof nbFavorites === 'number') {
      Animated.sequence([
        Animated.timing(scaleAnimation.current, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(scaleAnimation.current, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start()
    }
  }, [nbFavorites])

  return scaleAnimation.current
}
