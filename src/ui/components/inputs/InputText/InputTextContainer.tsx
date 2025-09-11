import React from 'react'
import { View, ViewStyle } from 'react-native'
import styled, { DefaultTheme } from 'styled-components/native'

import { ColorsType } from 'theme/types'
import { getSpacing, padding } from 'ui/theme'

type Props = {
  isError?: boolean
  isFocus?: boolean
  isDisabled?: boolean
  inputHeight?: 'small' | 'regular' | 'tall'
  style?: ViewStyle
  children?: React.ReactNode
}

export const InputTextContainer: React.FC<Props> = ({
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
  return theme.designSystem.color.border.brandSecondary
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

  const horizontalPadding = 3

  return {
    height: getHeightValue(),
    width: '100%',
    flexDirection: 'row',
    borderStyle: 'solid',
    borderWidth: getSpacing(0.25),
    borderColor: getBorderColor(theme, isFocus, isDisabled, isError),
    backgroundColor: isDisabled
      ? theme.designSystem.color.background.disabled
      : theme.designSystem.color.background.default,

    ...padding(0, horizontalPadding), // This assures that things don't move when the border width changes on focus
    alignItems: 'center',
    borderRadius: theme.designSystem.size.borderRadius.m,
    marginTop: theme.designSystem.size.spacing.xs,
  }
})
