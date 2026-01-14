import React, { forwardRef } from 'react'
import { TextInput as RNTextInput, TextStyle } from 'react-native'

import { TextInputProps } from 'ui/components/inputs/types'
import { TextInput } from 'ui/designSystem/TextInput/TextInput'
import { getSpacing } from 'ui/theme'

interface LargeTextInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  label: string
  labelStyle?: TextStyle
  value: string
  onChangeText: (suggestion: string) => void
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
    errorMessage,
    ...inputProps
  },
  forwardedRef
) => {
  const maxValueLength = maxLength ?? 800

  return (
    <TextInput
      label={label}
      labelStyle={labelStyle}
      value={value}
      onChangeText={onChangeText}
      containerStyle={{ height: containerHeight ?? getSpacing(50) }}
      multiline
      accessibilityHint={errorMessage}
      maxLength={maxValueLength + 25}
      errorMessage={errorMessage}
      ref={forwardedRef}
      characterCount={maxValueLength}
      {...inputProps}
    />
  )
}

export const LargeTextInput = forwardRef<RNTextInput, LargeTextInputProps>(WithRefLargeTextInput)
