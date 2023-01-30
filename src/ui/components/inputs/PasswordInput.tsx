import React, { forwardRef, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'

import { useE2eTestId } from 'libs/e2e/useE2eTestId'
import { TextInput } from 'ui/components/inputs/TextInput'
import { TextInputProps } from 'ui/components/inputs/types'
import { Eye } from 'ui/svg/icons/Eye'
import { EyeSlash } from 'ui/svg/icons/EyeSlash'

export interface Props extends TextInputProps {
  label?: string
  placeholder?: string
  isRequiredField?: boolean
}

const WithRefPasswordInput: React.ForwardRefRenderFunction<RNTextInput, Props> = (
  { label, placeholder, ...inputProps },
  forwardedRef
) => {
  const e2eTestId = useE2eTestId(label ?? 'Mot de passe')
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
      {...e2eTestId}
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
