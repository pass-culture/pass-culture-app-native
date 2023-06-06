import React from 'react'
import {
  NativeSyntheticEvent,
  TargetedEvent,
  // eslint-disable-next-line no-restricted-imports
  TouchableOpacity as RNTouchableOpacity,
  TouchableOpacityProps,
} from 'react-native'
import styled from 'styled-components/native'

import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { touchableFocusOutline } from 'ui/theme/customFocusOutline/touchableFocusOutline'

export function TouchableOpacity({
  onFocus,
  onBlur,
  children,
  accessibilityLabel,
  testID,
  ...props
}: TouchableOpacityProps) {
  const { onFocus: onFocusDefault, onBlur: onBlurDefault, isFocus } = useHandleFocus()

  const onStyledFocus = (e: NativeSyntheticEvent<TargetedEvent>) => {
    onFocusDefault()
    onFocus?.(e)
  }
  const onStyledBlur = (e: NativeSyntheticEvent<TargetedEvent>) => {
    onBlurDefault()
    onBlur?.(e)
  }

  return (
    <StyledTouchableOpacity
      isFocus={isFocus}
      onFocus={onStyledFocus}
      onBlur={onStyledBlur}
      {...props}
      {...accessibilityAndTestId(accessibilityLabel, testID)}>
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
