import React from 'react'
import { ViewProps } from 'react-native'
import styled from 'styled-components/native'

import { StickyBottomGradient } from 'ui/components/StickyBottomGradient/StickyBottomGradient'

type Props = ViewProps & {
  displayGradient?: boolean
}

// to have a correct layout, the parent of StickyBottomWrapper must be in `position: relative;`
export const StickyBottomWrapper = ({ children, displayGradient = true, ...props }: Props) => {
  return (
    <Container {...props}>
      {displayGradient ? <StickyBottomGradient /> : null}
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
