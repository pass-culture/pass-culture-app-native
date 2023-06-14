import { BlurView } from '@react-native-community/blur'
import React from 'react'
import styled from 'styled-components/native'

type Props = {
  height: number
  blurAmount?: number
  blurType?: 'dark' | 'light' | 'xlight'
}

export const BlurHeader = ({ height, blurAmount = 8, blurType = 'light' }: Props) => {
  return (
    <BlurNativeContainer height={height}>
      <Blurred blurType={blurType} blurAmount={blurAmount} />
    </BlurNativeContainer>
  )
}

const Blurred = styled(BlurView)({
  flex: 1,
})

const BlurNativeContainer = styled.View<{ height: number }>(({ height }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height,
  overflow: 'hidden',
  backdropFilter: 'blur(20px)',
}))
