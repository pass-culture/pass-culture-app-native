import React from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { getShadow, getSpacing, padding } from 'ui/theme'

type Props = {
  isError?: boolean
  isFocus?: boolean
  inputHeight?: number
  isInputDisabled?: boolean
}

const defaultProps: Props = {
  isError: false,
  isFocus: false,
  isInputDisabled: false,
}

export const LargeInputContainer: React.FC<Props> = (props) => {
  return (
    <StyledView
      height={props.inputHeight}
      isError={props.isError}
      isFocus={props.isFocus}
      isInputDisabled={props.isInputDisabled}>
      {props.children}
    </StyledView>
  )
}

LargeInputContainer.defaultProps = defaultProps

const StyledView = styled.View<{
  height?: number
  isFocus?: boolean
  isError?: boolean
  isInputDisabled?: boolean
}>(({ theme, height, isFocus, isInputDisabled, isError }) => {
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
    width: '100%',
    height: height || getSpacing(23.5),
    flexDirection: 'row',
    alignItems: 'flex-start',
    ...padding(2, 3),
    borderRadius: 16,
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
