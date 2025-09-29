import React, { forwardRef } from 'react'
import { TextInput as RNTextInput, TextStyle } from 'react-native'

import { TextInputProps } from 'ui/components/inputs/types'
import { InputText } from 'ui/designSystem/InputText/InputText'
import { getSpacing } from 'ui/theme'

interface LargeTextInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  label: string
  labelStyle?: TextStyle
  value: string
  onChangeText: (suggestion: string) => void
  showErrorMessage: boolean
  errorMessage?: string
  containerHeight?: number
  maxValueLength?: number
}

const WithRefLargeTextInput: React.ForwardRefRenderFunction<RNTextInput, LargeTextInputProps> = (
  {
    label,
    labelStyle,
    value,
    onChangeText,
    containerHeight,
    maxLength,
    showErrorMessage,
    errorMessage,
    ...inputProps
  },
  forwardedRef
) => {
  const maxValueLength = maxLength ?? 800
  const computedErrorMessage = showErrorMessage
    ? (errorMessage ?? 'Tu as atteint le nombre de caractères maximal.')
    : undefined

  return (
    <InputText
      label={label}
      labelStyle={labelStyle}
      value={value}
      onChangeText={onChangeText}
      containerStyle={{ height: containerHeight ?? getSpacing(50) }}
      multiline
      accessibilityHint={computedErrorMessage}
      maxLength={maxValueLength + 25}
      errorMessage={computedErrorMessage}
      ref={forwardedRef}
      characterCount={maxValueLength}
      {...inputProps}
    />
  )
}

export const LargeTextInput = forwardRef<RNTextInput, LargeTextInputProps>(WithRefLargeTextInput)
