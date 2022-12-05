import React, { forwardRef, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'
import styled from 'styled-components/native'

import { styledButton } from 'ui/components/buttons/styledButton'
import { TextInput } from 'ui/components/inputs/TextInput'
import { TextInputProps } from 'ui/components/inputs/types'
import { Touchable } from 'ui/components/touchable/Touchable'
import { Eye as DefaultEye } from 'ui/svg/icons/Eye'
import { EyeSlash as DefaultEyeSlash } from 'ui/svg/icons/EyeSlash'
import { getSpacing } from 'ui/theme'

interface Props extends TextInputProps {
  label?: string
  placeholder?: string
  isRequiredField?: boolean
}

const WithRefPasswordInput: React.ForwardRefRenderFunction<RNTextInput, Props> = (
  { label, placeholder, ...inputProps },
  forwardedRef
) => {
  const [shouldHidePassword, setShouldHidePassword] = useState(true)

  function togglePasswordDisplay() {
    setShouldHidePassword(!shouldHidePassword)
  }

  return (
    <TextInput
      label={label ?? 'Mot de passe'}
      autoCapitalize="none"
      placeholder={placeholder ?? 'Ton mot de passe'}
      textContentType="password"
      secureTextEntry={shouldHidePassword}
      testID="Mot de passe"
      {...inputProps}
      ref={forwardedRef}
      insideRightButton={
        <IconTouchableOpacity
          testID="toggle-password-visibility"
          accessibilityLabel={
            shouldHidePassword ? 'Afficher le mot de passe' : 'Cacher le mot de passe'
          }
          onPress={togglePasswordDisplay}>
          {shouldHidePassword ? <EyeSlash /> : <Eye />}
        </IconTouchableOpacity>
      }
    />
  )
}

export const PasswordInput = forwardRef<RNTextInput, Props>(WithRefPasswordInput)

const IconTouchableOpacity = styledButton(Touchable)({
  maxWidth: getSpacing(15),
})

const EyeSlash = styled(DefaultEyeSlash).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``

const Eye = styled(DefaultEye).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``
