import { useMemo } from 'react'
import { Animated } from 'react-native'
import { useTheme } from 'styled-components/native'

import { getAnimationState } from 'ui/animations/helpers/getAnimationState'

import { AnimationState } from './types'

export function useOfferHeaderAnimation(
  headerTransition: Animated.AnimatedInterpolation<string | number>
): AnimationState {
  const theme = useTheme()

  const animationState = useMemo(() => {
    const { animationState } = getAnimationState(theme, headerTransition)
    return animationState
  }, [theme, headerTransition])

  return animationState
}
