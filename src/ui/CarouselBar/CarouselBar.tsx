import React from 'react'
import Animated, { interpolateColor, useAnimatedStyle } from 'react-native-reanimated'
import styled, { useTheme } from 'styled-components/native'

import { getSpacing } from 'ui/theme'

type Props = {
  index: number
  animValue: Animated.SharedValue<number>
}

export const CarouselBar: React.FunctionComponent<Props> = ({ animValue, index }) => {
  const theme = useTheme()

  const animStyle = useAnimatedStyle(() => {
    const inputRange = [index - 1, index, index + 1]

    const colorOutputRange = [
      theme.colors.greyMedium,
      theme.colors.greyDark,
      theme.colors.greyMedium,
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
  backgroundColor: theme.colors.greyDark,
  overflow: 'hidden',
  margin: getSpacing(1),
}))
