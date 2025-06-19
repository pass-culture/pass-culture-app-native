import React, { memo, useEffect, useRef } from 'react'
import { Animated, Easing } from 'react-native'
import styled from 'styled-components/native'

import { ANIMATION_USE_NATIVE_DRIVER } from 'ui/components/animationUseNativeDriver'
import { Logo } from 'ui/svg/icons/Logo'
import { AccessibleIcon } from 'ui/svg/icons/types'

function NotMemoizedSpinner({ size, color, testID }: AccessibleIcon) {
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
        useNativeDriver: ANIMATION_USE_NATIVE_DRIVER,
      })
    ).start()
  }, [animatedValue])

  return (
    <SpinnerContainer testID={testID}>
      <Animated.View style={{ width: Number(size), transform: [{ rotate: spin }] }}>
        <Logo size={size} color={color} />
      </Animated.View>
    </SpinnerContainer>
  )
}

const SpinnerContainer = styled.View({
  alignItems: 'center',
})

export const Spinner = memo(
  styled(NotMemoizedSpinner).attrs(({ theme }) => ({
    color: theme.designSystem.color.icon.subtle,
    size: theme.icons.sizes.standard,
  }))``
)
