import { BlurView as RNCBlurView } from '@react-native-community/blur'
import React from 'react'
import { useColorScheme } from 'react-native'
import styled from 'styled-components/native'

type Props = {
  blurAmount?: number
  blurType?: 'dark' | 'light' | 'xlight'
}

export const BlurView = ({ blurAmount = 8, blurType }: Props) => {
  const colorScheme = useColorScheme()
  const computedBlurType = blurType || (colorScheme === 'dark' ? 'dark' : 'light')

  return <Blurred blurType={computedBlurType} blurAmount={blurAmount} />
}

const Blurred = styled(RNCBlurView)({
  flex: 1,
})
