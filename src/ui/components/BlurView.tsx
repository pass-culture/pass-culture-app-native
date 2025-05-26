import { BlurView as RNCBlurView } from '@react-native-community/blur'
import React from 'react'
import styled, { useTheme } from 'styled-components/native'

type Props = {
  blurAmount?: number
  blurType?: 'dark' | 'light' | 'xlight'
}

export const BlurView = ({ blurAmount = 8, blurType }: Props) => {
  const { colorScheme } = useTheme()
  const computedBlurType = blurType || colorScheme

  return <Blurred blurType={computedBlurType} blurAmount={blurAmount} />
}

const Blurred = styled(RNCBlurView)({
  flex: 1,
})
