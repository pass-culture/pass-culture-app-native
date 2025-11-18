import React, { memo, useEffect, useRef } from 'react'
import { Animated, useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { ColorsType } from 'theme/types'
import { ANIMATION_USE_NATIVE_DRIVER } from 'ui/components/animationUseNativeDriver'

import { SnackBarProgressBarProps } from './SnackBarProgressBar.types'

const NotMemoizedProgressBar = (props: SnackBarProgressBarProps) => {
  const windowWidth = useWindowDimensions().width

  const progress = useRef(new Animated.Value(0)).current

  function animateProgressBar() {
    if (props.timeout) {
      Animated.timing(progress, {
        toValue: 1,
        duration: props.timeout,
        useNativeDriver: ANIMATION_USE_NATIVE_DRIVER,
      }).start()
    }
  }

  useEffect(() => {
    progress.setValue(0)
    animateProgressBar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.refresher, props.timeout])

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-windowWidth / 2, 0],
  })

  return (
    <StyledAnimatedView
      testID="snackbar-progressbar"
      backgroundColor={props.color}
      style={{
        width: windowWidth,
        transform: [{ translateX: translateX }, { scaleX: progress }],
      }}
    />
  )
}

export const SnackBarProgressBar = memo(NotMemoizedProgressBar)

const StyledAnimatedView = styled(Animated.View)<{
  backgroundColor: ColorsType
}>(({ backgroundColor }) => ({
  height: 4,
  backgroundColor: backgroundColor,
}))
