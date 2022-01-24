import React, { memo, useEffect, useRef } from 'react'
import { Animated, Easing, Platform } from 'react-native'
import styled from 'styled-components/native'

import { Logo } from 'ui/svg/icons/Logo'
import { IconInterface } from 'ui/svg/icons/types'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

const USE_NATIVE_DRIVER = Platform.select({ default: false, ios: true, android: true })

function NotMemoizedSpinner({ size = 40, color = ColorsEnum.GREY_DARK }: IconInterface) {
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
        useNativeDriver: USE_NATIVE_DRIVER,
      })
    ).start()
  }, [animatedValue])

  return (
    <SpinnerContainer>
      <Animated.View style={{ width: size, transform: [{ rotate: spin }] }}>
        <Logo size={size} color={color} />
      </Animated.View>
    </SpinnerContainer>
  )
}

const SpinnerContainer = styled.View({
  alignItems: 'center',
})

export const Spinner = memo(NotMemoizedSpinner)
