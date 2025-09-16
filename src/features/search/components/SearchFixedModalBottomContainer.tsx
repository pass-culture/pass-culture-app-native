import React, { useState } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { useForHeightKeyboardEvents } from 'ui/components/keyboard/useKeyboardEvents'

export const SearchFixedModalBottomContainer = ({ children }) => {
  const { modal } = useTheme()
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  useForHeightKeyboardEvents(setKeyboardHeight)
  return (
    <Container paddingBottom={keyboardHeight ? keyboardHeight - modal.spacing.SM : 0}>
      {children}
    </Container>
  )
}

const Container = styled.View<{ paddingBottom: number }>(({ paddingBottom, theme }) => ({
  paddingBottom,
  backgroundColor: theme.designSystem.color.background.default,
}))
