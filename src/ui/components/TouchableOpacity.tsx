import React, { useState } from 'react'
import {
  NativeSyntheticEvent,
  TargetedEvent,
  // eslint-disable-next-line no-restricted-imports
  TouchableOpacity as RNTouchableOpacity,
  TouchableOpacityProps,
} from 'react-native'
import styled from 'styled-components/native'

import { touchableFocusOutline } from 'ui/theme/customFocusOutline/touchableFocusOutline'

export function TouchableOpacity({ onFocus, onBlur, children, ...props }: TouchableOpacityProps) {
  const [isFocus, setIsFocus] = useState(false)

  const onStyledFocus = (e: NativeSyntheticEvent<TargetedEvent>) => {
    setIsFocus(true)
    onFocus && onFocus(e)
  }
  const onStyledBlur = (e: NativeSyntheticEvent<TargetedEvent>) => {
    setIsFocus(false)
    onBlur && onBlur(e)
  }

  return (
    <StyledTouchableOpacity
      isFocus={isFocus}
      onFocus={onStyledFocus}
      onBlur={onStyledBlur}
      {...props}>
      {children}
    </StyledTouchableOpacity>
  )
}

const StyledTouchableOpacity = styled(RNTouchableOpacity).attrs(({ activeOpacity, theme }) => ({
  activeOpacity: activeOpacity ?? theme.activeOpacity,
}))<{ unselectable?: boolean; isFocus?: boolean }>(({ theme, unselectable, isFocus }) => ({
  userSelect: unselectable ? 'none' : 'auto',
  ...touchableFocusOutline(theme, isFocus),
}))

// eslint-disable-next-line no-restricted-imports
export { TouchableOpacity as RNTouchableOpacity } from 'react-native'
