import React, { forwardRef, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'

import { TextInput } from 'ui/components/inputs/TextInput'
import { TextInputProps } from 'ui/components/inputs/types'
import { Eye } from 'ui/svg/icons/Eye'
import { EyeSlash } from 'ui/svg/icons/EyeSlash'

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
      rightButton={{
        icon: shouldHidePassword ? EyeSlash : Eye,
        onPress: togglePasswordDisplay,
        accessibilityLabel: shouldHidePassword
          ? 'Afficher le mot de passe'
          : 'Cacher le mot de passe',
      }}
    />
  )
}

export const PasswordInput = forwardRef<RNTextInput, Props>(WithRefPasswordInput)
