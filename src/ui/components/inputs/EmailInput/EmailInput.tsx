import React, { forwardRef } from 'react'
import { TextInput as RNTextInput } from 'react-native'

import { InputTextProps } from 'ui/components/inputs/types'
import { InputText } from 'ui/designSystem/InputText/InputText'

export interface EmailInputProps extends Omit<InputTextProps, 'value' | 'onChangeText'> {
  email: string
  onEmailChange: (email: string) => void
}

const WithRefEmailInput: React.ForwardRefRenderFunction<RNTextInput, EmailInputProps> = (
  { email, onEmailChange, ...inputProps },
  forwardedRef
) => {
  return (
    <InputText
      autoCapitalize="none"
      autoComplete="email"
      keyboardType="email-address"
      onChangeText={onEmailChange}
      description="Exemple&nbsp;: tonadresse@email.com"
      textContentType="emailAddress"
      value={email}
      maxLength={120}
      testID="Entrée pour l’email"
      ref={forwardedRef}
      {...inputProps}
    />
  )
}

export const EmailInput = forwardRef<RNTextInput, EmailInputProps>(WithRefEmailInput)
