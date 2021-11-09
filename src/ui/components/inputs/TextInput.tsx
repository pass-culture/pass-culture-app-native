import React, { forwardRef, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'

import { BaseTextInput } from './BaseTextInput'
import { StyledInputContainer } from './StyledInputContainer'
import { getCustomTextInputProps, getRNTextInputProps, TextInputProps } from './types'

const WithRefTextInput: React.ForwardRefRenderFunction<RNTextInput, TextInputProps> = (
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
    if (nativeProps.onBlur) {
      // @ts-ignore pass event later when needed
      nativeProps.onBlur()
    }
  }

  return (
    <StyledInputContainer isFocus={isFocus} isError={customProps.isError}>
      <BaseTextInput {...nativeProps} ref={forwardedRef} onFocus={onFocus} onBlur={onBlur} />
    </StyledInputContainer>
  )
}

export const TextInput = forwardRef<RNTextInput, TextInputProps>(WithRefTextInput)
