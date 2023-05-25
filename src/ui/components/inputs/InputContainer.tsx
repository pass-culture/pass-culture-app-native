import React from 'react'
import { ViewStyle, View } from 'react-native'
import styled, { DefaultTheme } from 'styled-components/native'

import { getSpacing, padding } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

type Props = {
  isError?: boolean
  isFocus?: boolean
  isDisabled?: boolean
  inputHeight?: 'small' | 'regular' | 'tall'
  style?: ViewStyle
  children?: React.ReactNode
}

const defaultProps: Props = {
  isError: false,
  isFocus: false,
  inputHeight: 'small',
  isDisabled: false,
}

const BORDER_FOCUS_INCREASE = 0.25

export const InputContainer: React.FC<Props> = (props) => (
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

InputContainer.defaultProps = defaultProps

const getBorderColor = (
  theme: DefaultTheme,
  isFocus?: boolean,
  isDisabled?: boolean,
  isError?: boolean
) => {
  if (isDisabled) {
    return undefined
  }
  if (isFocus) {
    return theme.colors.black
  }
  if (isError) {
    return theme.colors.error
  }
  return theme.colors.greySemiDark
}

const StyledView = styled(View)<{
  height: Props['inputHeight']
  isFocus?: boolean
  isError?: boolean
  isDisabled?: boolean
  focusOutlineColor?: ColorsEnum
}>(({ height, isFocus, isError, isDisabled, theme }) => {
  const getHeightValue = () => {
    if (height === 'small') {
      return theme.inputs.height.small
    }
    return height === 'regular' ? theme.inputs.height.regular : theme.inputs.height.tall
  }

  const borderWidth = isFocus ? getSpacing(0.25 + BORDER_FOCUS_INCREASE) : getSpacing(0.25)
  const horizontalPadding = isFocus ? 4 : 4 + BORDER_FOCUS_INCREASE
  const tallHorizontalPadding = isFocus ? 3 : 3 + BORDER_FOCUS_INCREASE

  return {
    height: getHeightValue(),
    width: '100%',
    flexDirection: 'row',
    borderStyle: 'solid',
    borderWidth,
    borderColor: getBorderColor(theme, isFocus, isDisabled, isError),
    backgroundColor: isDisabled ? theme.colors.greyLight : theme.colors.white,
    ...(height === 'tall'
      ? {
          ...padding(2, tallHorizontalPadding), // This assures that things don't move when the border width changes on focus
          alignItems: 'flex-start',
          borderRadius: 16,
        }
      : {
          ...padding(0, horizontalPadding), // This assures that things don't move when the border width changes on focus
          alignItems: 'center',
          borderRadius: 22,
        }),
  }
})
