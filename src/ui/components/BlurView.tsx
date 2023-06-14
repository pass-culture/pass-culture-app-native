import { BlurView as RNCBlurView } from '@react-native-community/blur'
import React from 'react'
import styled from 'styled-components/native'

type Props = {
  blurAmount?: number
  blurType?: 'dark' | 'light' | 'xlight'
}

export const BlurView = ({ blurAmount = 8, blurType = 'light' }: Props) => {
  return <Blurred blurType={blurType} blurAmount={blurAmount} />
}

const Blurred = styled(RNCBlurView)({
  flex: 1,
})
