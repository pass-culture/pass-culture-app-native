import React, { forwardRef, useState } from 'react'
import {
  NativeSyntheticEvent,
  TextInput as RNTextInput,
  TextInputFocusEventData,
} from 'react-native'
import styled from 'styled-components/native'

import { accessibilityAndTestId } from 'tests/utils'
import { Eye } from 'ui/svg/icons/Eye'
import { EyeSlash } from 'ui/svg/icons/EyeSlash'

import { BaseTextInput } from './BaseTextInput'
import { InputContainer } from './InputContainer'
import { getCustomTextInputProps, getRNTextInputProps, TextInputProps } from './types'

const WithRefPasswordInput: React.ForwardRefRenderFunction<RNTextInput, TextInputProps> = (
  props,
  forwardedRef
) => {
  const nativeProps = getRNTextInputProps(props)
  const customProps = getCustomTextInputProps(props)

  const [shouldHidePassword, setShouldHidePassword] = useState(true)
  const [isFocus, setIsFocus] = useState(false)

  function togglePasswordDisplay() {
    setShouldHidePassword(!shouldHidePassword)
  }

  function onFocus(e: NativeSyntheticEvent<TextInputFocusEventData>) {
    setIsFocus(true)
    props?.onFocus?.(e)
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
        ref={forwardedRef}
      />
      <IconTouchableOpacity
        {...accessibilityAndTestId("Basculer l'affichage du mot de passe")}
        onPress={togglePasswordDisplay}>
        {shouldHidePassword ? (
          <EyeSlash {...accessibilityAndTestId('eye-slash')} size="100%" />
        ) : (
          <Eye {...accessibilityAndTestId('eye')} size="100%" />
        )}
      </IconTouchableOpacity>
    </InputContainer>
  )
}

export const PasswordInput = forwardRef<RNTextInput, TextInputProps>(WithRefPasswordInput)

const StyledBaseTextInput = styled(BaseTextInput)({
  flex: 0.9,
})

const IconTouchableOpacity = styled.TouchableOpacity({
  flex: 0.1,
  maxWidth: 60,
})
