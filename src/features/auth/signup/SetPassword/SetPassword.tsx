import { t } from '@lingui/macro'
import React, { FunctionComponent, useRef, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'

import {
  isPasswordCorrect,
  PasswordSecurityRules,
} from 'features/auth/components/PasswordSecurityRules'
import { PreValidationSignupStepProps } from 'features/auth/signup/types'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PasswordInput } from 'ui/components/inputs/PasswordInput'
import { Spacer } from 'ui/theme'
import { Form } from 'ui/web/form/Form'

export const SetPassword: FunctionComponent<PreValidationSignupStepProps> = (props) => {
  const [password, setPassword] = useState('')
  const disabled = !isPasswordCorrect(password)

  const passwordInput = useRef<RNTextInput | null>(null)

  function submitPassword() {
    if (!disabled) {
      props.goToNextStep({ password })
    }
  }

  return (
    <Form>
      <PasswordInput
        label={t`Mot de passe`}
        value={password}
        autoFocus={true}
        onChangeText={setPassword}
        placeholder={t`Ton mot de passe`}
        onSubmitEditing={submitPassword}
        ref={passwordInput}
      />
      <PasswordSecurityRules password={password} />
      <Spacer.Column numberOfSpaces={6} />
      <ButtonPrimary
        title={t`Continuer`}
        accessibilityLabel={props.accessibilityLabelForNextStep}
        onPress={submitPassword}
        disabled={disabled}
      />
      <Spacer.Column numberOfSpaces={5} />
    </Form>
  )
}
