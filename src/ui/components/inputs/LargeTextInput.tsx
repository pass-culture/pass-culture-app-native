import React, { forwardRef, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'

import { BaseTextInput } from './BaseTextInput'
import { LargeInputContainer } from './LargeInputContainer'
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
  }

  return (
    <LargeInputContainer isFocus={isFocus} isError={customProps.isError}>
      <BaseTextInput
        {...nativeProps}
        ref={forwardedRef}
        onFocus={onFocus}
        onBlur={onBlur}
        multiline={true}
      />
    </LargeInputContainer>
  )
}

export const LargeTextInput = forwardRef<RNTextInput, TextInputProps>(WithRefTextInput)
