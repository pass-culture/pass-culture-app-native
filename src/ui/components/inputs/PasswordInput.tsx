import React, { useState } from 'react'
import styled from 'styled-components/native'

import { Eye } from 'ui/svg/icons/Eye'
import { EyeSlash } from 'ui/svg/icons/EyeSlash'
import { ColorsEnum, Typo } from 'ui/theme'

import { InputContainer } from './InputContainer'
import { TextInputProps } from './TextInput'

export function PasswordInput(props: TextInputProps): JSX.Element {
  const [shouldHidePassword, setShouldHidePassword] = useState(true)
  const [isFocus, setIsFocus] = useState(false)

  function togglePasswordDisplay() {
    setShouldHidePassword(!shouldHidePassword)
  }

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
        secureTextEntry={shouldHidePassword}
        autoFocus={props.autoFocus}
        onFocus={onFocus}
        onBlur={onBlur}>
        <Typo.Body color={ColorsEnum.GREY_DARK}>{props.value}</Typo.Body>
      </StyledTextInput>
      <IconTouchableOpacity onPress={togglePasswordDisplay}>
        {shouldHidePassword ? (
          <EyeSlash testID="eye-slash" size="100%" />
        ) : (
          <Eye testID="eye" size="100%" />
        )}
      </IconTouchableOpacity>
    </InputContainer>
  )
}

const StyledTextInput = styled.TextInput({
  flex: 0.9,
  padding: 0,
})

const IconTouchableOpacity = styled.TouchableOpacity({
  flex: 0.1,
  maxWidth: 60,
})
