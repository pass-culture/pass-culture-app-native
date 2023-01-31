import React, { forwardRef } from 'react'
import { TextInput as RNTextInput } from 'react-native'

import { useE2eTestId } from 'libs/e2e/useE2eTestId'
import { TextInput } from 'ui/components/inputs/TextInput'
import { TextInputProps } from 'ui/components/inputs/types'

export interface EmailInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  label: string
  email: string
  onEmailChange: (email: string) => void
  isRequiredField?: boolean
}

const WithRefEmailInput: React.ForwardRefRenderFunction<RNTextInput, EmailInputProps> = (
  { email, onEmailChange, ...inputProps },
  forwardedRef
) => {
  const e2eTestId = useE2eTestId('Entrée pour l’email')

  return (
    <TextInput
      autoCapitalize="none"
      autoComplete="email"
      keyboardType="email-address"
      onChangeText={onEmailChange}
      placeholder="tonadresse@email.com"
      textContentType="emailAddress"
      value={email}
      maxLength={120}
      {...inputProps}
      {...e2eTestId}
      ref={forwardedRef}
    />
  )
}

export const EmailInput = forwardRef<RNTextInput, EmailInputProps>(WithRefEmailInput)
