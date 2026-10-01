import React from 'react'
import { TextInput as RNTextInput } from 'react-native'
import styled, { DefaultTheme } from 'styled-components/native'

import { BaseTextInput } from 'ui/components/inputs/BaseTextInput'
import { getRNTextInputProps } from 'ui/components/inputs/types'
import { TextInputContainer } from 'ui/designSystem/TextInput/TextInputContainer'

export const SIZE_TO_HEIGHT = (theme: DefaultTheme) => ({
  small: theme.inputs.height.small,
  regular: theme.inputs.height.regular,
  tall: theme.inputs.height.tall,
})

type OneTimePasswordInputFieldProps = {
  index: number
  value: string
  numberOfInputs: number
  size: keyof ReturnType<typeof SIZE_TO_HEIGHT>
  label: string
  isError: boolean
  isDisabled: boolean
  isFocused: boolean
  textInputID: string
  textInputProps: ReturnType<typeof getRNTextInputProps>
  setInputRef: (index: number, ref: RNTextInput | null) => void
  handleChangeText: (value: string, index: number) => void
  handleBackspace: (index: number) => void
  setFocusedIndex: (index: number | null) => void
}

export const OneTimePasswordInputField = ({
  index,
  value,
  numberOfInputs,
  size,
  label,
  isError,
  isDisabled,
  isFocused,
  textInputID,
  textInputProps,
  setInputRef,
  handleChangeText,
  handleBackspace,
  setFocusedIndex,
}: OneTimePasswordInputFieldProps) => (
  <StyledTextInputContainer
    size={size}
    isError={isError}
    isDisabled={isDisabled}
    isFocused={isFocused}>
    <StyledBaseTextInput
      {...textInputProps}
      nativeID={`${textInputID}-${index}`}
      accessibilityLabel={`${label} - caractère ${index + 1} sur ${numberOfInputs}`}
      ref={(ref) => setInputRef(index, ref)}
      value={value}
      disabled={isDisabled}
      keyboardType="number-pad"
      maxLength={1}
      selectTextOnFocus
      onChangeText={(inputValue) => handleChangeText(inputValue, index)}
      onKeyPress={(event) => {
        if (event.nativeEvent.key !== 'Backspace') return
        handleBackspace(index)
      }}
      onFocus={() => setFocusedIndex(index)}
      onBlur={() => setFocusedIndex(null)}
    />
  </StyledTextInputContainer>
)

const StyledTextInputContainer = styled(TextInputContainer)<{
  size: keyof ReturnType<typeof SIZE_TO_HEIGHT>
}>(({ theme, size }) => ({
  width: SIZE_TO_HEIGHT(theme)[size],
  height: SIZE_TO_HEIGHT(theme)[size],
  justifyContent: 'center',
}))

const StyledBaseTextInput = styled(BaseTextInput)({
  textAlign: 'center',
})
