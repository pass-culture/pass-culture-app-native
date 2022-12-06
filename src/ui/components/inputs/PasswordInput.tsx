import React, { forwardRef, useState } from 'react'
import {
  NativeSyntheticEvent,
  TextInput as RNTextInput,
  TextInputFocusEventData,
} from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { styledButton } from 'ui/components/buttons/styledButton'
import { FlexInputLabel } from 'ui/components/InputLabel/FlexInputLabel'
import { ContainerWithMaxWidth } from 'ui/components/inputs/ContainerWithMaxWidth'
import { LabelContainer } from 'ui/components/inputs/LabelContainer'
import { RequiredLabel } from 'ui/components/inputs/RequiredLabel'
import { Touchable } from 'ui/components/touchable/Touchable'
import { Eye as DefaultEye } from 'ui/svg/icons/Eye'
import { EyeSlash as DefaultEyeSlash } from 'ui/svg/icons/EyeSlash'
import { Spacer, Typo } from 'ui/theme'

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
  const { onFocus: onFocusDefault, onBlur, isFocus } = useHandleFocus()
  const passwordInputID = uuidv4()

  function togglePasswordDisplay() {
    setShouldHidePassword(!shouldHidePassword)
  }

  function onFocus(e: NativeSyntheticEvent<TextInputFocusEventData>) {
    onFocusDefault()
    props?.onFocus?.(e)
  }

  return (
    <ContainerWithMaxWidth>
      {!!customProps.label && (
        <React.Fragment>
          <FlexInputLabel htmlFor={passwordInputID}>
            <LabelContainer>
              <Typo.Body>{customProps.label}</Typo.Body>
              {!!customProps.isRequiredField && <RequiredLabel />}
            </LabelContainer>
          </FlexInputLabel>
          <Spacer.Column numberOfSpaces={2} />
        </React.Fragment>
      )}
      <InputContainer
        isFocus={isFocus}
        isError={customProps.isError}
        isDisabled={customProps.disabled}>
        <StyledBaseTextInput
          {...nativeProps}
          nativeID={passwordInputID}
          onFocus={onFocus}
          onBlur={onBlur}
          secureTextEntry={shouldHidePassword}
          ref={forwardedRef}
          aria-describedby={customProps.accessibilityDescribedBy}
          autoCapitalize="none"
          testID="Mot de passe"
        />
        <Spacer.Row numberOfSpaces={2} />
        <IconTouchableOpacity
          testID="toggle-password-visibility"
          accessibilityLabel={
            shouldHidePassword ? 'Afficher le mot de passe' : 'Cacher le mot de passe'
          }
          onPress={togglePasswordDisplay}>
          {shouldHidePassword ? <EyeSlash /> : <Eye />}
        </IconTouchableOpacity>
      </InputContainer>
    </ContainerWithMaxWidth>
  )
}

export const PasswordInput = forwardRef<RNTextInput, TextInputProps>(WithRefPasswordInput)

const StyledBaseTextInput = styled(BaseTextInput)({
  flex: 1,
})

const IconTouchableOpacity = styledButton(Touchable)({
  maxWidth: 60,
  alignItems: 'flex-end',
})

const EyeSlash = styled(DefaultEyeSlash).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``

const Eye = styled(DefaultEye).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``
