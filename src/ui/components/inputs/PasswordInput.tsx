import React, { forwardRef, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'

import { InputTextProps } from 'ui/components/inputs/types'
import { InputText } from 'ui/designSystem/InputText/InputText'
import { Eye } from 'ui/svg/icons/Eye'
import { EyeSlash } from 'ui/svg/icons/EyeSlash'

export interface Props extends Omit<InputTextProps, 'label'> {
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
    <InputText
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
