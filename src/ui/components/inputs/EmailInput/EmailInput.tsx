import React, { forwardRef } from 'react'
import { TextInput as RNTextInput } from 'react-native'

import { TextInput } from 'ui/components/inputs/TextInput'
import { TextInputProps } from 'ui/components/inputs/types'

export interface EmailInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  label?: string
  email: string
  onEmailChange: (email: string) => void
  isRequiredField?: boolean
}

const WithRefEmailInput: React.ForwardRefRenderFunction<RNTextInput, EmailInputProps> = (
  { email, onEmailChange, label, ...inputProps },
  forwardedRef
) => {
  return (
    <TextInput
      autoCapitalize="none"
      autoComplete="email"
      keyboardType="email-address"
      label={label ?? 'Adresse e-mail'}
      onChangeText={onEmailChange}
      placeholder="tonadresse@email.com"
      textContentType="emailAddress"
      value={email}
      maxLength={120}
      {...inputProps}
      testID="Entrée pour l’email"
      ref={forwardedRef}
    />
  )
}

export const EmailInput = forwardRef<RNTextInput, EmailInputProps>(WithRefEmailInput)
