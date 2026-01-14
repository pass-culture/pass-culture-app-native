import React, { forwardRef, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'

import { TextInputProps } from 'ui/components/inputs/types'
import { TextInput } from 'ui/designSystem/TextInput/TextInput'
import { Eye } from 'ui/svg/icons/Eye'
import { EyeSlash } from 'ui/svg/icons/EyeSlash'

export interface Props extends Omit<TextInputProps, 'label'> {
  label?: string
}

const WithRefPasswordInput: React.ForwardRefRenderFunction<RNTextInput, Props> = (
  { label, ...inputProps },
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
      textContentType="password"
      secureTextEntry={shouldHidePassword}
      testID={label ?? 'Mot de passe'}
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
