import React, { forwardRef } from 'react'
import { TextInput as RNTextInput } from 'react-native'

import { InputText } from 'ui/components/inputs/InputText/InputText'
import { TextInputProps } from 'ui/components/inputs/types'
import { getSpacing } from 'ui/theme'

interface LargeTextInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  label: string
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
