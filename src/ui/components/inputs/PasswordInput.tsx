import React, { useState } from 'react'
import styled from 'styled-components/native'

import { Eye } from 'ui/svg/icons/Eye'
import { EyeSlash } from 'ui/svg/icons/EyeSlash'

import { BaseTextInput } from './BaseTextInput'
import { InputContainer } from './InputContainer'
import { getCustomTextInputProps, getRNTextInputProps, TextInputProps } from './types'

export function PasswordInput(props: TextInputProps): JSX.Element {
  const nativeProps = getRNTextInputProps(props)
  const customProps = getCustomTextInputProps(props)

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
    <InputContainer isFocus={isFocus} isError={customProps.isError}>
      <StyledBaseTextInput
        {...nativeProps}
        onFocus={onFocus}
        onBlur={onBlur}
        secureTextEntry={shouldHidePassword}
      />
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

const StyledBaseTextInput = styled(BaseTextInput)({
  flex: 0.9,
})

const IconTouchableOpacity = styled.TouchableOpacity({
  flex: 0.1,
  maxWidth: 60,
})
