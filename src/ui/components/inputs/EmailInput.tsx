import { t } from '@lingui/macro'
import React, { forwardRef } from 'react'
import { TextInput as RNTextInput } from 'react-native'
import { v4 as uuidv4 } from 'uuid'

import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { TextInput } from 'ui/components/inputs/TextInput'
import { TextInputProps } from 'ui/components/inputs/types'

interface Props extends TextInputProps {
  label: string
  email: string
  onEmailChange: (email: string) => void
  isRequiredField?: boolean
}

const withRefEmailInput: React.ForwardRefRenderFunction<RNTextInput, Props> = (
  { email, onEmailChange, ...inputProps },
  forwardedRef
) => {
  const emailInputID = uuidv4()

  return (
    <TextInput
      nativeID={emailInputID}
      autoCapitalize="none"
      autoComplete="email"
      keyboardType="email-address"
      onChangeText={onEmailChange}
      placeholder={t`tonadresse@email.com`}
      textContentType="emailAddress"
      value={email}
      maxLength={120}
      {...accessibilityAndTestId(t`Entrée pour l'email`)}
      {...inputProps}
      ref={forwardedRef}
    />
  )
}

export const EmailInput = forwardRef<RNTextInput, Props>(withRefEmailInput)
