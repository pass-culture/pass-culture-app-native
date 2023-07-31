import React from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { BlurView } from 'ui/components/BlurView'

type Props = {
  height: number
  blurAmount?: number
  blurType?: 'dark' | 'light' | 'xlight'
}

export const BlurHeader = ({ height, blurAmount = 8, blurType = 'light' }: Props) => {
  // There is an issue with the blur on Android: we chose not to render it and use a white background
  // https://github.com/Kureev/react-native-blur/issues/511
  if (Platform.OS === 'android') return null

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
