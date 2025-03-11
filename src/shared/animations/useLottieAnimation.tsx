import { useCallback, useEffect, useRef } from 'react'

import { useAppStateChange } from 'libs/appState'
import LottieView from 'libs/lottie'
import { AnimationObject } from 'ui/animations/type'

export const usePartialLottieAnimation = (animation?: AnimationObject) => {
  const animationRef = useRef<LottieView>(null)

  const playAnimation = useCallback(() => {
    const lottieAnimation = animationRef.current
    if (animation && lottieAnimation) lottieAnimation.play(0, 62)
  }, [animation])

  useAppStateChange(playAnimation, undefined)
  useEffect(playAnimation, [playAnimation])

  return animationRef
}
