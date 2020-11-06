import React, { useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'
import styled from 'styled-components/native'

import { ColorsEnum, Typo } from 'ui/theme'

import { InputContainer } from './InputContainer'

type UsedTextInputProps = Pick<
  React.ComponentProps<typeof RNTextInput>,
  'onChangeText' | 'placeholder' | 'value' | 'autoFocus' | 'keyboardType'
>

type CustomProps = {
  isError?: boolean
  width?: number | string
  height?: number | string
}

export type TextInputProps = UsedTextInputProps & CustomProps

export function TextInput(props: TextInputProps): JSX.Element {
  const [isFocus, setIsFocus] = useState(false)

  function onFocus() {
    setIsFocus(true)
  }

  function onBlur() {
    setIsFocus(false)
  }

  return (
    <InputContainer
      isFocus={isFocus}
      isError={props.isError}
      width={props.width}
      height={props.height}>
      <StyledTextInput
        placeholder={props.placeholder}
        onChangeText={props.onChangeText}
        keyboardType={props.keyboardType}
        autoFocus={props.autoFocus}
        onFocus={onFocus}
        onBlur={onBlur}>
        <Typo.Body color={ColorsEnum.GREY_DARK}>{props.value}</Typo.Body>
      </StyledTextInput>
    </InputContainer>
  )
}

const StyledTextInput = styled.TextInput({
  flex: 1,
  padding: 0,
})
