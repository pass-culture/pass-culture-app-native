import React, { FunctionComponent, useEffect, useState } from 'react'
import { Animated, Easing, Platform, ViewProps } from 'react-native'
import styled from 'styled-components/native'

import { UniqueColors } from 'ui/theme'

export const ModalOverlay: FunctionComponent<ViewProps & { visible: boolean }> = (props) => {
  const [opacity] = useState(new Animated.Value(0))
  const [isDisplayed, setIsDisplayed] = useState(props.visible)

  useEffect(() => {
    if (props.visible) {
      setIsDisplayed(true)
      Animated.timing(opacity, {
        duration: 300,
        toValue: 1,
        easing: Easing.linear,
        useNativeDriver: Platform.OS == 'android',
      }).start()
    }

    if (!props.visible) {
      Animated.timing(opacity, {
        duration: 300,
        toValue: 0,
        useNativeDriver: Platform.OS == 'android',
      }).start(() => setIsDisplayed(false))
    }
  }, [props.visible])

  return isDisplayed ? <AnimatedOverlay opacity={opacity} /> : null
}
const AnimatedOverlay = styled(Animated.View)<{ opacity: Animated.Value }>({
  flex: 1,
  position: 'absolute',
  top: 0,
  height: '100%',
  width: '100%',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  backgroundColor: UniqueColors.GREY_OVERLAY,
  zIndex: 49,
})
