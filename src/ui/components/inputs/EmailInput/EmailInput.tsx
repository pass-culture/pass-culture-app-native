import React, { forwardRef } from 'react'
import { TextInput as RNTextInput } from 'react-native'

import { TextInput } from 'ui/components/inputs/TextInput'
import { TextInputProps } from 'ui/components/inputs/types'

export interface Props extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  label: string
  email: string
  onEmailChange: (email: string) => void
  isRequiredField?: boolean
}

const withRefEmailInput: React.ForwardRefRenderFunction<RNTextInput, Props> = (
  { email, onEmailChange, ...inputProps },
  forwardedRef
) => (
  <TextInput
    autoCapitalize="none"
    autoComplete="email"
    keyboardType="email-address"
    onChangeText={onEmailChange}
    placeholder="tonadresse@email.com"
    textContentType="emailAddress"
    value={email}
    maxLength={120}
    testID="Entrée pour l’email"
    {...inputProps}
    ref={forwardedRef}
  />
)

export const EmailInput = forwardRef<RNTextInput, Props>(withRefEmailInput)
