import colorAlpha from 'color-alpha'
import React from 'react'
import styled from 'styled-components/native'

type Props = {
  children?: React.ReactNode
}

export function BlurryWrapper({ children }: Props) {
  // TODO(PC-37604): Implement back blur effect for iOS at least
  return <TransparentBackground>{children}</TransparentBackground>
}

const TransparentBackground = styled.View(({ theme }) => ({
  backgroundColor: colorAlpha(theme.designSystem.color.background.locked, 0.5),
}))
