import React, { PropsWithChildren } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import styled from 'styled-components/native'

export const KeyboardAvoidingViewWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  return Platform.OS === 'android' ? (
    <StyledKeyboardAvoidingView behavior="height" keyboardVerticalOffset={30}>
      {children}
    </StyledKeyboardAvoidingView>
  ) : (
    <React.Fragment>{children}</React.Fragment>
  )
}

const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView)({
  width: '100%',
})
