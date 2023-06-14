import { BlurView } from '@react-native-community/blur'
import React from 'react'
import { Animated, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

type Props = {
  height: number
  blurAmount?: number
  blurType?: 'dark' | 'light' | 'xlight'
  style?: Animated.WithAnimatedObject<ViewStyle>
}

export const AnimatedBlurHeader = ({
  height,
  blurAmount = 8,
  blurType = 'light',
  style,
}: Props) => {
  return (
    <BlurNativeContainer height={height} style={style}>
      <Blurred blurType={blurType} blurAmount={blurAmount} />
    </BlurNativeContainer>
  )
}

const Blurred = styled(BlurView)({
  flex: 1,
})

const BlurNativeContainer = styled(Animated.View)<{ height: number }>(({ height }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height,
  overflow: 'hidden',
}))
