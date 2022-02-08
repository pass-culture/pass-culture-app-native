import { t } from '@lingui/macro'
import React, { forwardRef } from 'react'
import { TextInput as RNTextInput } from 'react-native'
import { v4 as uuidv4 } from 'uuid'

import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { InputLabel } from 'ui/components/InputLabel'
import { InputContainer } from 'ui/components/inputs/InputContainer'
import { LabelContainer } from 'ui/components/inputs/LabelContainer'
import { RequiredLabel } from 'ui/components/inputs/RequiredLabel'
import { TextInput } from 'ui/components/inputs/TextInput'
import { TextInputProps } from 'ui/components/inputs/types'
import { Spacer } from 'ui/theme'

interface Props extends TextInputProps {
  label: string
  email: string
  onEmailChange: (email: string) => void
  isRequiredField?: boolean
}

const withRefEmailInput: React.ForwardRefRenderFunction<RNTextInput, Props> = (
  { label, email, onEmailChange, isRequiredField = false, ...inputProps },
  forwardedRef
) => {
  const emailInputID = uuidv4()

  return (
    <InputContainer>
      {!!label && (
        <React.Fragment>
          <LabelContainer>
            <InputLabel htmlFor={emailInputID}>{label}</InputLabel>
            {!!isRequiredField && <RequiredLabel />}
          </LabelContainer>
          <Spacer.Column numberOfSpaces={2} />
        </React.Fragment>
      )}
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
    </InputContainer>
  )
}

export const EmailInput = forwardRef<RNTextInput, Props>(withRefEmailInput)
