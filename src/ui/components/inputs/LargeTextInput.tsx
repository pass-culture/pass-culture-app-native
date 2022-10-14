import React, { forwardRef, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { InputLabel } from 'ui/components/InputLabel/InputLabel'
import { ContainerWithMaxWidth } from 'ui/components/inputs/ContainerWithMaxWidth'
import { InputContainer } from 'ui/components/inputs/InputContainer'
import { Spacer } from 'ui/theme'

import { BaseTextInput } from './BaseTextInput'
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
    <ContainerWithMaxWidth>
      {!!customProps.label && (
        <React.Fragment>
          <InputLabel htmlFor={largeTextInputID}>{customProps.label}</InputLabel>
          <Spacer.Column numberOfSpaces={2} />
        </React.Fragment>
      )}
      <InputContainer
        isFocus={isFocus}
        isError={customProps.isError}
        isDisabled={customProps.disabled}
        inputHeight="tall">
        <LargeBaseTextInput
          {...nativeProps}
          ref={forwardedRef}
          onFocus={onFocus}
          onBlur={onBlur}
          multiline
          testID="large-text-input"
          nativeID={largeTextInputID}
        />
      </InputContainer>
    </ContainerWithMaxWidth>
  )
}

const LargeBaseTextInput = styled(BaseTextInput)({
  textAlignVertical: 'top', // specify this attribute to set the cursor correctly in large inputs on android
})

export const LargeTextInput = forwardRef<RNTextInput, TextInputProps>(WithRefTextInput)
