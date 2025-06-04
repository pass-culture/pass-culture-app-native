import { BlurView } from '@react-native-community/blur'
import colorAlpha from 'color-alpha'
import React from 'react'
import { Platform } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { BlurAmount } from 'ui/components/BlurryWrapper/BlurAmount'

type Props = {
  blurAmount?: BlurAmount
  children?: React.ReactNode
}

export function BlurryWrapper({ blurAmount = BlurAmount.LIGHT, children }: Props) {
  const { colorScheme } = useTheme()

  const blurType: 'light' | 'dark' = colorScheme === 'dark' ? 'dark' : 'light'

  return Platform.OS === 'android' ? (
    <TransparentBackground>{children}</TransparentBackground>
  ) : (
    <StyledBlurry blurType={blurType} blurAmount={blurAmount} testID="blurry-wrapper">
      {children}
    </StyledBlurry>
  )
}

const StyledBlurry = styled(BlurView)<{
  blurType: string
  blurAmount: BlurAmount
}>({
  flex: 1,
})

const TransparentBackground = styled.View(({ theme }) => ({
  backgroundColor: colorAlpha(theme.colors.white, 0.5),
}))
