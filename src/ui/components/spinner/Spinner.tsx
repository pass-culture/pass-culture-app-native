import React, { memo, useEffect, useRef } from 'react'
import { Animated, Easing, Platform } from 'react-native'

import { Logo } from 'ui/svg/icons/Logo'
import { IconInterface } from 'ui/svg/icons/types'

function NotMemoizedSpinner({ size, color }: IconInterface) {
  const animatedValue = useRef(new Animated.Value(0)).current
  const spin = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: ['ios', 'android'].includes(Platform.OS),
      })
    ).start()
  }, [animatedValue])

  return (
    <Animated.View style={{ width: size, transform: [{ rotate: spin }] }}>
      <Logo size={size} color={color} />
    </Animated.View>
  )
}

export const Spinner = memo(NotMemoizedSpinner)
