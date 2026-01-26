import React from 'react'
import Animated, { SharedValue, interpolateColor, useAnimatedStyle } from 'react-native-reanimated'
import styled, { useTheme } from 'styled-components/native'

import { getSpacing } from 'ui/theme'

type Props = {
  index: number
  animValue: SharedValue<number>
}

export const CarouselBar: React.FunctionComponent<Props> = ({ animValue, index }) => {
  const { designSystem } = useTheme()

  const animStyle = useAnimatedStyle(() => {
    const inputRange = [index - 1, index, index + 1]

    const colorOutputRange = [
      designSystem.color.background.disabled,
      designSystem.color.background.inverted,
      designSystem.color.background.disabled,
    ]

    return {
      backgroundColor: interpolateColor(animValue?.value, inputRange, colorOutputRange),
    }
  }, [animValue, index])

  return <Bar testID="carousel-bar" style={animStyle} />
}

const Bar = styled(Animated.View)(({ theme }) => ({
  width: theme.designSystem.size.spacing.xl,
  height: 3,
  borderRadius: theme.designSystem.size.borderRadius.pill,
  backgroundColor: theme.designSystem.color.background.subtle,
  overflow: 'hidden',
  margin: getSpacing(1),
}))
