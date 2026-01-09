import React, { useEffect } from 'react'
import { useWindowDimensions } from 'react-native'
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import styled from 'styled-components/native'

import { ColorsType } from 'theme/types'

import { SnackBarProgressBarProps } from './SnackBarProgressBar.types'

export const SnackBarProgressBar = (props: SnackBarProgressBarProps) => {
  const windowWidth = useWindowDimensions().width

  const progress = useSharedValue(0)

  useEffect(() => {
    if (!props.visible) {
      return // keeps the bar full while the parent opacity fades out.
    }

    progress.value = 0

    if (props.timeout) {
      progress.value = withTiming(1, {
        duration: props.timeout,
        easing: Easing.linear,
      })
    }
  }, [props.refresher, props.timeout, progress, props.visible])

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(progress.value, [0, 1], [-windowWidth / 2, 0])

    return {
      width: windowWidth,
      transform: [{ translateX: translateX }, { scaleX: progress.value }],
    }
  })

  return (
    <StyledAnimatedView
      testID="snackbar-progressbar"
      backgroundColor={props.color}
      style={animatedStyle}
    />
  )
}

const StyledAnimatedView = styled(Animated.View)<{
  backgroundColor: ColorsType
}>(({ backgroundColor }) => ({
  height: 4,
  backgroundColor: backgroundColor,
}))
