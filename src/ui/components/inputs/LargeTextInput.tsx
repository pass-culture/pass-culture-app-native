import React, { forwardRef, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { InputLabel } from 'ui/components/InputLabel'
import { Spacer } from 'ui/theme'

import { BaseTextInput } from './BaseTextInput'
import { LargeInputContainer } from './LargeInputContainer'
import { getCustomTextInputProps, getRNTextInputProps, TextInputProps } from './types'

const WithRefTextInput: React.ForwardRefRenderFunction<RNTextInput, TextInputProps> = (
  props,
  forwardedRef
) => {
  const nativeProps = getRNTextInputProps(props)
  const customProps = getCustomTextInputProps(props)
  const largeTextInputID = uuidv4()

  const [isFocus, setIsFocus] = useState(false)

  function onFocus() {
    setIsFocus(true)
  }

  function onBlur() {
    setIsFocus(false)
  }

  return (
    <React.Fragment>
      {!!customProps.label && (
        <React.Fragment>
          <InputLabel htmlFor={largeTextInputID}>{customProps.label}</InputLabel>
          <Spacer.Column numberOfSpaces={2} />
        </React.Fragment>
      )}
      <LargeInputContainer isFocus={isFocus} isError={customProps.isError}>
        <LargeBaseTextInput
          {...nativeProps}
          ref={forwardedRef}
          onFocus={onFocus}
          onBlur={onBlur}
          multiline={true}
          testID="large-text-input"
          nativeID={largeTextInputID}
        />
      </LargeInputContainer>
    </React.Fragment>
  )
}

const LargeBaseTextInput = styled(BaseTextInput)({
  textAlignVertical: 'top', // specify this attribute to set the cursor correctly in large inputs on android
})

export const LargeTextInput = forwardRef<RNTextInput, TextInputProps>(WithRefTextInput)
