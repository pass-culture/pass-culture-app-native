import React, { useState, useRef, useEffect, RefObject, useCallback } from 'react'
import { StatusBar, Text, TouchableOpacity, ViewProps, ViewStyle } from 'react-native'
import { AnimatableProperties, View as AnimatableView } from 'react-native-animatable'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import { getSpacing } from 'ui/theme'
import { ZIndexes } from 'ui/theme/layers'

type RefType = RefObject<
  React.Component<AnimatableProperties<ViewStyle> & ViewProps, never, never> & {
    fadeOutUp: (duration: number) => void
    fadeInDown: (duration: number) => void
  }
> | null

export type PropsType = {
  visible: boolean
  message: string
  onClose: () => void
  backgroundColor: string
  color: string
  animationDuration: number
}

export const SnackBar = (props: PropsType) => {
  const [isVisible, setVisible] = useState(false)
  const containerRef: RefType = useRef(null)

  const triggerVanishAnimation = useCallback(async () => {
    containerRef?.current?.fadeOutUp(350)
    setVisible(false)
  }, [])
  const triggerApparitionAnimation = useCallback(async () => {
    setVisible(true)
    containerRef?.current?.fadeInDown(350)
  }, [])

  useEffect(() => {
    if (props.visible && !isVisible) {
      triggerApparitionAnimation()
    }
    if (!props.visible && isVisible) {
      triggerVanishAnimation()
    }
  }, [props.visible])
  const { top } = useSafeAreaInsets()
  return (
    <AnimatedContainer
      backgroundColor={props.backgroundColor}
      marginTop={top}
      easing="ease"
      duration={props.animationDuration}
      ref={containerRef}>
      <StatusBar hidden />
      {isVisible && (
        <ContentContainer testID="toasterContainer">
          <TouchableOpacity onPress={props.onClose}>
            <Text>{props.message}</Text>
          </TouchableOpacity>
        </ContentContainer>
      )}
    </AnimatedContainer>
  )
}
const AnimatedContainer = styled(AnimatableView)<{ backgroundColor: string; marginTop: number }>(
  ({ backgroundColor, marginTop = 0 }) => ({
    position: 'absolute',
    top: marginTop,
    left: 0,
    right: 0,
    backgroundColor,
    zIndex: ZIndexes.SNACK_BAR,
  })
)

const ContentContainer = styled.View({
  flexDirection: 'row',
  padding: getSpacing(4),
})
