import { BlurView } from '@react-native-community/blur'
import colorAlpha from 'color-alpha'
import React from 'react'
import { Platform } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { ColorScheme } from 'libs/styled/useColorScheme'
import { BlurAmount } from 'ui/components/BlurryWrapper/BlurAmount'

type Props = {
  blurAmount?: BlurAmount
  children?: React.ReactNode
}

export function BlurryWrapper({ blurAmount = BlurAmount.LIGHT, children }: Props) {
  const { colorScheme } = useTheme()

  const blurType = colorScheme === ColorScheme.DARK ? ColorScheme.DARK : ColorScheme.LIGHT

  return Platform.OS === 'android' ? (
    <TransparentBackground>{children}</TransparentBackground>
  ) : (
    <FlexView>
      <StyledBlurry blurType={blurType} blurAmount={blurAmount} testID="blurry-wrapper" />
      <FlexView>{children}</FlexView>
    </FlexView>
  )
}

const FlexView = styled.View({
  flex: 1,
})

const StyledBlurry = styled(BlurView)<{
  blurType: string
  blurAmount: BlurAmount
}>({
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
})

const TransparentBackground = styled.View(({ theme }) => ({
  backgroundColor: colorAlpha(theme.designSystem.color.background.locked, 0.5),
}))
