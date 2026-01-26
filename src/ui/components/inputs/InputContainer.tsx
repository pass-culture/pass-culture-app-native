import React from 'react'
import { ViewStyle, View } from 'react-native'
import styled, { DefaultTheme } from 'styled-components/native'

import { ColorsType } from 'theme/types'
import { InputSize } from 'ui/designSystem/TextInput/types'
import { getSpacing, padding } from 'ui/theme'

type Props = {
  isError?: boolean
  isFocus?: boolean
  isDisabled?: boolean
  inputHeight?: InputSize
  style?: ViewStyle
  children?: React.ReactNode
}

const BORDER_FOCUS_INCREASE = 0.25

export const InputContainer: React.FC<Props> = ({
  children,
  inputHeight = 'small',
  isDisabled = false,
  isError = false,
  isFocus = false,
  style,
}) => (
  <StyledView
    testID="styled-input-container"
    height={inputHeight}
    isFocus={isFocus}
    isError={isError}
    isDisabled={isDisabled}
    style={style}>
    {children}
  </StyledView>
)

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
  focusOutlineColor?: ColorsType
}>(({ height, isFocus, isError, isDisabled, theme }) => {
  const getHeightValue = () => {
    if (height === 'small') {
      return theme.inputs.height.small
    }
    return height === 'regular' ? theme.inputs.height.regular : theme.inputs.height.tall
  }

  const borderWidth = isFocus
    ? getSpacing(0.25 + BORDER_FOCUS_INCREASE)
    : theme.designSystem.size.spacing.xxs
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
          borderRadius: theme.designSystem.size.borderRadius.l,
        }
      : {
          ...padding(0, horizontalPadding), // This assures that things don't move when the border width changes on focus
          alignItems: 'center',
          borderRadius: theme.designSystem.size.borderRadius.xl,
        }),
  }
})
