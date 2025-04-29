import React from 'react'
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated'
import styled, { useTheme } from 'styled-components/native'

type Props = {
  index: number
  animValue: SharedValue<number>
}

const SMALL_DOT_SIZE = 6
const BIG_DOT_SIZE = SMALL_DOT_SIZE + 2

export const CarouselDot: React.FunctionComponent<Props> = ({ animValue, index }) => {
  const theme = useTheme()

  const animStyle = useAnimatedStyle(() => {
    const inputRange = [index - 1, index, index + 1]
    const marginOutputRange = [2, 0, 2]
    const colorOutputRange = [theme.colors.greyDark, theme.colors.black, theme.colors.greyDark]
    const widthOutputRange = [SMALL_DOT_SIZE, BIG_DOT_SIZE, SMALL_DOT_SIZE]

    return {
      backgroundColor: interpolateColor(animValue?.value, inputRange, colorOutputRange),
      width: interpolate(animValue?.value, inputRange, widthOutputRange, Extrapolation.CLAMP),
      height: interpolate(animValue?.value, inputRange, widthOutputRange, Extrapolation.CLAMP),
      margin: interpolate(animValue?.value, inputRange, marginOutputRange, Extrapolation.CLAMP),
    }
  }, [animValue, index])

  return <Dot testID="carousel-dot" style={animStyle} />
}

const Dot = styled(Animated.View)(({ theme }) => ({
  borderRadius: BIG_DOT_SIZE,
  backgroundColor: theme.colors.greyDark,
  overflow: 'hidden',
}))
