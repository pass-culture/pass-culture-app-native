import React from 'react'
import Animated, { SharedValue, interpolateColor, useAnimatedStyle } from 'react-native-reanimated'
import styled, { useTheme } from 'styled-components/native'

import { getSpacing } from 'ui/theme'

type Props = {
  index: number
  animValue: SharedValue<number>
}

export const CarouselBar: React.FunctionComponent<Props> = ({ animValue, index }) => {
  const theme = useTheme()

  const animStyle = useAnimatedStyle(() => {
    const inputRange = [index - 1, index, index + 1]

    const colorOutputRange = [
      theme.designSystem.color.background.disabled,
      theme.designSystem.color.background.inverted,
      theme.designSystem.color.background.disabled,
    ]

    return {
      backgroundColor: interpolateColor(animValue?.value, inputRange, colorOutputRange),
    }
  }, [animValue, index])

  return <Bar testID="carousel-bar" style={animStyle} />
}

const Bar = styled(Animated.View)(({ theme }) => ({
  width: getSpacing(5),
  height: 3,
  borderRadius: getSpacing(12.5),
  backgroundColor: theme.designSystem.color.background.subtle,
  overflow: 'hidden',
  margin: getSpacing(1),
}))
