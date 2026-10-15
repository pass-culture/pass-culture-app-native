import React, { useCallback, useState } from 'react'
import { Animated } from 'react-native'

import { ANIMATION_USE_NATIVE_DRIVER } from 'ui/components/animationUseNativeDriver'
import { LineSeparator } from 'ui/components/LineSeparator'
import { useLayout } from 'ui/hooks/useLayout'

type FavoriteAnimatedWrapperProps = {
  onAnimationEnd: () => void
  children: (triggerRemoveAnimation: () => void) => React.ReactNode
}

export const FavoriteAnimatedWrapper = ({
  onAnimationEnd,
  children,
}: FavoriteAnimatedWrapperProps) => {
  const { onLayout, height } = useLayout()

  const [animatedOpacity] = useState(() => new Animated.Value(1))
  const [animatedCollapse] = useState(() => new Animated.Value(1))

  const triggerRemoveAnimation = useCallback(() => {
    Animated.parallel([
      Animated.timing(animatedOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: ANIMATION_USE_NATIVE_DRIVER,
      }),
      Animated.timing(animatedCollapse, {
        toValue: 0,
        delay: 100,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(onAnimationEnd)
  }, [animatedOpacity, animatedCollapse, onAnimationEnd])

  const animatedCollapseStyle = {
    height: height
      ? animatedCollapse.interpolate({
          inputRange: [0, 1],
          outputRange: [0, height],
        })
      : undefined,
  }

  return (
    <Animated.View onLayout={onLayout} style={animatedCollapseStyle}>
      <Animated.View style={{ opacity: animatedOpacity }}>
        {children(triggerRemoveAnimation)}
        <LineSeparator />
      </Animated.View>
    </Animated.View>
  )
}
