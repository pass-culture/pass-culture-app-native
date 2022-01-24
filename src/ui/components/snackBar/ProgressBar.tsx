import React, { useEffect, memo } from 'react'
import { useWindowDimensions } from 'react-native'
import { Animated } from 'react-native'
import styled from 'styled-components/native'

// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

import { ProgressBarProps } from './ProgressBar.types'

const NotMemoizedProgressBar = (props: ProgressBarProps) => {
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
  }, [props.refresher])

  return (
    <StyledAnimatedView
      testID="snackbar-progressbar"
      backgroundColor={props.color}
      width={progressBarCompletion}
    />
  )
}

export const ProgressBar = memo(NotMemoizedProgressBar)

const StyledAnimatedView = styled(Animated.View)<{
  backgroundColor: ColorsEnum
  width: Animated.Value
}>(({ backgroundColor, width }) => ({
  height: 4,
  backgroundColor: backgroundColor,
  // @ts-expect-error: avoid typescript error due to not supported Animated Css/Styles types
  width: width._value /* The alternative is to use inline style */,
}))
