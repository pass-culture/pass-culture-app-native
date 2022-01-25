import { t } from '@lingui/macro'
import React, { forwardRef, useState } from 'react'
import {
  NativeSyntheticEvent,
  TextInput as RNTextInput,
  TextInputFocusEventData,
} from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { accessibilityAndTestId } from 'tests/utils'
import { InputLabel } from 'ui/components/InputLabel'
import { InputContainer } from 'ui/components/inputs/InputContainer'
import { LabelContainer } from 'ui/components/inputs/LabelContainer'
import { RequiredLabel } from 'ui/components/inputs/RequiredLabel'
import { Eye } from 'ui/svg/icons/Eye'
import { EyeSlash } from 'ui/svg/icons/EyeSlash'
import { getSpacing, Spacer } from 'ui/theme'

import { BaseTextInput } from './BaseTextInput'
import { StyledInputContainer } from './StyledInputContainer'
import { getCustomTextInputProps, getRNTextInputProps, TextInputProps } from './types'

const WithRefPasswordInput: React.ForwardRefRenderFunction<RNTextInput, TextInputProps> = (
  props,
  forwardedRef
) => {
  const nativeProps = getRNTextInputProps(props)
  const customProps = getCustomTextInputProps(props)

  const [shouldHidePassword, setShouldHidePassword] = useState(true)
  const [isFocus, setIsFocus] = useState(false)
  const passwordInputID = uuidv4()

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
    <InputContainer>
      {!!customProps.label && (
        <React.Fragment>
          <LabelContainer>
            <InputLabel htmlFor={passwordInputID}>{customProps.label}</InputLabel>
            {!!customProps.isRequiredField && <RequiredLabel />}
          </LabelContainer>
          <Spacer.Column numberOfSpaces={2} />
        </React.Fragment>
      )}
      <StyledInputContainer
        isFocus={isFocus}
        isError={customProps.isError}
        isInputDisabled={customProps.disabled}>
        <StyledBaseTextInput
          {...nativeProps}
          nativeID={passwordInputID}
          onFocus={onFocus}
          onBlur={onBlur}
          secureTextEntry={shouldHidePassword}
          ref={forwardedRef}
          aria-describedby={customProps.accessibilityDescribedBy}
          {...accessibilityAndTestId(t`Mot de passe`)}
        />
        <IconTouchableOpacity
          testID="toggle-password-visibility"
          accessibilityLabel={
            shouldHidePassword ? t`Afficher le mot de passe` : t`Cacher le mot de passe`
          }
          onPress={togglePasswordDisplay}>
          {shouldHidePassword ? <EyeSlash size={getSpacing(6)} /> : <Eye size={getSpacing(6)} />}
        </IconTouchableOpacity>
      </StyledInputContainer>
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
  alignItems: 'flex-end',
})
