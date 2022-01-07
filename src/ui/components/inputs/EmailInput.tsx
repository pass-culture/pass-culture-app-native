import { t } from '@lingui/macro'
import React, { forwardRef } from 'react'
import { TextInput as RNTextInput } from 'react-native'

import { accessibilityAndTestId } from 'tests/utils'
import { InputContainer } from 'ui/components/inputs/InputContainer'
import { LabelContainer } from 'ui/components/inputs/LabelContainer'
import { RequiredLabel } from 'ui/components/inputs/RequiredLabel'
import { TextInput } from 'ui/components/inputs/TextInput'
import { TextInputProps } from 'ui/components/inputs/types'
import { Spacer, Typo } from 'ui/theme'

interface Props extends TextInputProps {
  label: string
  email: string
  onEmailChange: (email: string) => void
  isRequiredField?: boolean
}

const withRefEmailInput: React.ForwardRefRenderFunction<RNTextInput, Props> = (
  { label, email, onEmailChange, isRequiredField = false, ...inputProps },
  forwardedRef
) => (
  <InputContainer>
    <LabelContainer>
      <Typo.Body>{label}</Typo.Body>
      {!!isRequiredField && <RequiredLabel />}
    </LabelContainer>

    <Spacer.Column numberOfSpaces={2} />
    <TextInput
      autoCapitalize="none"
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
  </InputContainer>
)

export const EmailInput = forwardRef<RNTextInput, Props>(withRefEmailInput)
