import React, { PropsWithChildren } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import styled from 'styled-components/native'

type Props = PropsWithChildren<{
  verticalOffset?: number
}>
export const KeyboardAvoidingViewWrapper: React.FC<Props> = ({ children, verticalOffset = 30 }) => {
  return Platform.OS === 'android' ? (
    <StyledKeyboardAvoidingView
      testID="keyboard-avoiding-view"
      behavior="height"
      keyboardVerticalOffset={verticalOffset}>
      {children}
    </StyledKeyboardAvoidingView>
  ) : (
    <React.Fragment>{children}</React.Fragment>
  )
}

const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView)({
  width: '100%',
})
