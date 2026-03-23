import React from 'react'
import { ViewProps } from 'react-native'
import styled from 'styled-components/native'

import { StickyBottomGradient } from 'ui/components/StickyBottomGradient/StickyBottomGradient'

// to have a correct layout, the parent of StickyBottomWrapper must be in `position: relative;`
export const StickyBottomWrapper = ({ children, ...props }: ViewProps) => {
  return (
    <Container {...props}>
      <StickyBottomGradient />
      {children}
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  width: '100%',
  backgroundColor: theme.designSystem.color.background.default,
}))
