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
    return theme.designSystem.color.border.disabled
  }
  if (isFocus) {
    // maybe we need another semantic color.text.focused
    return theme.designSystem.color.outline.default
  }
  if (isError) {
    return theme.designSystem.color.border.error
  }
  return theme.designSystem.color.border.default
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
    backgroundColor: isDisabled
      ? theme.designSystem.color.background.disabled
      : theme.designSystem.color.background.default,
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
