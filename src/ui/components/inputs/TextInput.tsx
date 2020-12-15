import React, { forwardRef, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'

import { BaseTextInput } from './BaseTextInput'
import { InputContainer } from './InputContainer'
import { getCustomTextInputProps, getRNTextInputProps, TextInputProps } from './types'

export const _PartialTextInput: React.ForwardRefRenderFunction<RNTextInput, TextInputProps> = (
  props,
  forwardedRef
) => {
  const nativeProps = getRNTextInputProps(props)
  const customProps = getCustomTextInputProps(props)

  const [isFocus, setIsFocus] = useState(false)

  function onFocus() {
    setIsFocus(true)
  }

  function onBlur() {
    setIsFocus(false)
  }

  return (
    <InputContainer isFocus={isFocus} isError={customProps.isError}>
      <BaseTextInput {...nativeProps} ref={forwardedRef} onFocus={onFocus} onBlur={onBlur} />
    </InputContainer>
  )
}

export const TextInput = forwardRef<RNTextInput, TextInputProps>(_PartialTextInput)
