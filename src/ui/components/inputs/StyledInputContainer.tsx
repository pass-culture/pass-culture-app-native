import React from 'react'
import { ViewStyle, View, Platform } from 'react-native'
import styled from 'styled-components/native'

import { getShadow, padding } from 'ui/theme'

type Props = {
  isError?: boolean
  isFocus?: boolean
  isDisabled?: boolean
  inputHeight?: 'small' | 'regular' | 'tall'
  style?: ViewStyle
}

const defaultProps: Props = {
  isError: false,
  isFocus: false,
  inputHeight: 'small',
  isDisabled: false,
}

export const StyledInputContainer: React.FC<Props> = (props) => (
  <StyledView
    testID="styled-input-container"
    height={props.inputHeight}
    isFocus={props.isFocus}
    isError={props.isError}
    isDisabled={props.isDisabled}
    style={props.style}>
    {props.children}
  </StyledView>
)

StyledInputContainer.defaultProps = defaultProps

const StyledView = styled(View)<{
  height: Props['inputHeight']
  isFocus?: boolean
  isError?: boolean
  isDisabled?: boolean
}>(({ height, isFocus, isError, isDisabled, theme }) => {
  let shadows = {}
  // ACCESSIBILITY : on the web, it is better to have no shadow to increase the contrast
  if (!isDisabled && Platform.OS !== 'web') {
    shadows = getShadow({
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      shadowColor: theme.colors.black,
      shadowOpacity: 0.15,
    })
  }

  const heightValue =
    height === 'small'
      ? theme.inputs.height.small
      : height === 'regular'
      ? theme.inputs.height.regular
      : theme.inputs.height.tall

  return {
    height: heightValue,
    width: '100%',
    flexDirection: 'row',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: isDisabled
      ? undefined
      : isFocus
      ? theme.colors.primary
      : isError
      ? theme.colors.error
      : theme.colors.greyMedium,
    backgroundColor: isDisabled ? theme.colors.greyLight : theme.colors.white,
    ...(height === 'tall'
      ? {
          ...padding(2, 3),
          alignItems: 'flex-start',
          borderRadius: 16,
        }
      : { ...padding(1, 4), alignItems: 'center', borderRadius: 22 }),
    ...shadows,
  }
})
