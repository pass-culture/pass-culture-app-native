import { BlurView } from '@react-native-community/blur'
import React from 'react'
import styled from 'styled-components/native'

type Props = {
  children?: React.ReactNode
}

export function BlurryWrapper({ children }: Props) {
  return (
    <StyledBlurry
      blurType="light"
      blurAmount={10}
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
