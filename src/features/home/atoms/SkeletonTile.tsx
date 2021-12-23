import React, { useEffect } from 'react'
import { Animated, Easing, StyleSheet } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { UniqueColors } from 'ui/theme'

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient)

interface DimensionProps {
  height: number
  width: number
  borderRadius: number
  fullWidth?: boolean
}

const useWaveAnimation = (width: number) => {
  const animation = new Animated.Value(0)
  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-width * 1.25, width * 1.25],
  })

  useEffect(() => {
    Animated.loop(
      Animated.timing(animation, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start()
  })

  return translateX
}

const start = { x: 0, y: 0 }
const end = { x: 1, y: 0 }
const colors = [
  UniqueColors.BACKGROUND_COLOR,
  UniqueColors.FOREGROUND_COLOR,
  UniqueColors.FOREGROUND_COLOR,
  UniqueColors.BACKGROUND_COLOR,
]

export function SkeletonTile({ width, height, borderRadius, fullWidth }: DimensionProps) {
  const translateX = useWaveAnimation(width)

  return (
    <BackgroundContainer
      height={height}
      width={width}
      borderRadius={borderRadius}
      fullWidth={fullWidth}>
      <AnimatedLinearGradient
        start={start}
        end={end}
        colors={colors}
        style={{
          borderRadius,
          ...(StyleSheet.absoluteFill as unknown as Record<string, unknown>),
          transform: [{ translateX }],
        }}
      />
    </BackgroundContainer>
  )
}

const BackgroundContainer = styled.View<DimensionProps>(
  ({ height, width, borderRadius, fullWidth }) => ({
    borderRadius,
    height,
    width: fullWidth ? '100%' : width,
    overflow: 'hidden',
    backgroundColor: UniqueColors.BACKGROUND_COLOR,
  })
)
