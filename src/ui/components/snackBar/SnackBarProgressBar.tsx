import React, { useEffect, memo } from 'react'
import { Animated, useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { ColorsType } from 'theme/types'

import { SnackBarProgressBarProps } from './SnackBarProgressBar.types'

const NotMemoizedProgressBar = (props: SnackBarProgressBarProps) => {
  const windowWidth = useWindowDimensions().width

  const progressBarCompletion = new Animated.Value(0)

  function animateProgressBarWidth() {
    props.timeout &&
      Animated.timing(progressBarCompletion, {
        toValue: windowWidth,
        duration: props.timeout,
        useNativeDriver: false,
      }).start()
  }

  useEffect(() => {
    progressBarCompletion.setValue(0)
    animateProgressBarWidth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.refresher])

  return (
    <StyledAnimatedView
      testID="snackbar-progressbar"
      backgroundColor={props.color}
      width={progressBarCompletion}
    />
  )
}

export const SnackBarProgressBar = memo(NotMemoizedProgressBar)

const StyledAnimatedView = styled(Animated.View)<{
  backgroundColor: ColorsType
  width: Animated.Value
}>(({ backgroundColor, width }) => ({
  height: 4,
  backgroundColor: backgroundColor,
  // @ts-expect-error: avoid typescript error due to not supported Animated Css/Styles types
  width: width._value /* The alternative is to use inline style */,
}))
