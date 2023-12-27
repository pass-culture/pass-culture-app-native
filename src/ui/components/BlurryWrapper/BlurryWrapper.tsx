import { BlurView } from '@react-native-community/blur'
import React from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

type Props = {
  children?: React.ReactNode
}

export function BlurryWrapper({ children }: Props) {
  return Platform.OS === 'android' ? (
    <TransparentBackground>{children}</TransparentBackground>
  ) : (
    <StyledBlurry
      blurType="light"
      blurAmount={1}
      reducedTransparencyFallbackColor="white"
      testID="blurry-wrapper">
      {children}
    </StyledBlurry>
  )
}

const StyledBlurry = styled(BlurView)<{
  blurType: string
  blurAmount: number
  reducedTransparencyFallbackColor: string
}>({
  flex: 1,
})

const TransparentBackground = styled.View({
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
})
