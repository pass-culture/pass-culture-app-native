import React from 'react'
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated'
import styled, { useTheme } from 'styled-components/native'

type Props = {
  index: number
  animValue: Animated.SharedValue<number>
}

export const CarouselDot: React.FunctionComponent<Props> = ({ animValue, index }) => {
  const width = 6
  const theme = useTheme()

  const animStyle = useAnimatedStyle(() => {
    const inputRange = [index - 1, index, index + 1]
    const marginOutputRange = [2, 0, 2]
    const outputRange = [theme.colors.greyDark, theme.colors.black, theme.colors.greyDark]
    const widthOutputRange = [width, width + 4, width]

    return {
      backgroundColor: interpolateColor(animValue?.value, inputRange, outputRange),
      width: interpolate(animValue?.value, inputRange, widthOutputRange, Extrapolation.CLAMP),
      height: interpolate(animValue?.value, inputRange, widthOutputRange, Extrapolation.CLAMP),
      margin: interpolate(animValue?.value, inputRange, marginOutputRange, Extrapolation.CLAMP),
    }
  }, [animValue, index])

  return <Dot testID="carousel-dot" style={animStyle} />
}

const Dot = styled(Animated.View)(({ theme }) => ({
  borderRadius: 50,
  backgroundColor: theme.colors.greyDark,
  overflow: 'hidden',
}))
