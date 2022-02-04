import React from 'react'
import { ViewStyle, View, Platform } from 'react-native'
import styled from 'styled-components/native'

import { getShadow, getSpacing, padding } from 'ui/theme'

type Props = {
  isError?: boolean
  isFocus?: boolean
  inputHeight?: 'small' | 'tall'
  isInputDisabled?: boolean
  style?: ViewStyle
}

const defaultProps: Props = {
  isError: false,
  isFocus: false,
  inputHeight: 'small',
  isInputDisabled: false,
}

export const StyledInputContainer: React.FC<Props> = (props) => (
  <StyledView
    height={props.inputHeight}
    isFocus={props.isFocus}
    isError={props.isError}
    isInputDisabled={props.isInputDisabled}
    style={props.style}>
    {props.children}
  </StyledView>
)

StyledInputContainer.defaultProps = defaultProps

const StyledView = styled(View)<{
  height: Props['inputHeight']
  isFocus?: boolean
  isError?: boolean
  isInputDisabled?: boolean
}>(({ height, isFocus, isError, isInputDisabled, theme }) => {
  let shadows = {}
  // ACCESSIBILITY : on the web, it is better to have no shadow to increase the contrast
  if (!isInputDisabled && Platform.OS !== 'web') {
    shadows = getShadow({
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      shadowColor: theme.colors.black,
      shadowOpacity: 0.15,
    })
  }
  return {
    height: height === 'tall' ? getSpacing(12) : getSpacing(10),
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    ...padding(1, 4),
    borderRadius: 22,
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: isInputDisabled
      ? undefined
      : isFocus
      ? theme.colors.primary
      : isError
      ? theme.colors.error
      : theme.colors.greyMedium,
    backgroundColor: isInputDisabled ? theme.colors.greyLight : theme.colors.white,
    ...shadows,
  }
})
