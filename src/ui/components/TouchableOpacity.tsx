import React from 'react'
import {
  NativeSyntheticEvent,
  TargetedEvent,
  // eslint-disable-next-line no-restricted-imports
  TouchableOpacity as RNTouchableOpacity,
  TouchableOpacityProps,
} from 'react-native'
import { TouchableOpacity as GestureTouchableOpacity } from 'react-native-gesture-handler'
import styled from 'styled-components/native'

import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { touchableFocusOutline } from 'ui/theme/customFocusOutline/touchableFocusOutline'

type Props = TouchableOpacityProps & { shouldUseGestureHandler?: boolean }
type StyledProps = { unselectable?: boolean; isFocus?: boolean }

export function TouchableOpacity({
  shouldUseGestureHandler = false,
  onFocus,
  onBlur,
  children,
  accessibilityLabel,
  testID,
  ...props
}: Props) {
  const { onFocus: onFocusDefault, onBlur: onBlurDefault, isFocus } = useHandleFocus()

  const onStyledFocus = (e: NativeSyntheticEvent<TargetedEvent>) => {
    onFocusDefault()
    onFocus?.(e)
  }
  const onStyledBlur = (e: NativeSyntheticEvent<TargetedEvent>) => {
    onBlurDefault()
    onBlur?.(e)
  }

  const InternalTouchableOpacity: React.FC<TouchableOpacityProps & StyledProps> =
    shouldUseGestureHandler ? StyledGestureTouchableOpacity : StyledRNTouchableOpacity

  return (
    <InternalTouchableOpacity
      isFocus={isFocus}
      onFocus={onStyledFocus}
      onBlur={onStyledBlur}
      {...props}
      {...accessibilityAndTestId(accessibilityLabel, testID)}>
      {children}
    </InternalTouchableOpacity>
  )
}

const addStyled = (Component: typeof RNTouchableOpacity | typeof GestureTouchableOpacity) =>
  styled(Component).attrs(({ activeOpacity, theme }) => ({
    activeOpacity: activeOpacity ?? theme.activeOpacity,
  }))<StyledProps>(({ theme, unselectable, isFocus }) => ({
    userSelect: unselectable ? 'none' : 'auto',
    ...touchableFocusOutline(theme, isFocus),
  }))
const StyledRNTouchableOpacity = addStyled(RNTouchableOpacity)
const StyledGestureTouchableOpacity = addStyled(GestureTouchableOpacity)

// eslint-disable-next-line no-restricted-imports
export { TouchableOpacity as RNTouchableOpacity } from 'react-native'
