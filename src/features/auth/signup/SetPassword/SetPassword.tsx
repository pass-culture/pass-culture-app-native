import { t } from '@lingui/macro'
import React, { FunctionComponent, useRef, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'

import {
  isPasswordCorrect,
  PasswordSecurityRules,
} from 'features/auth/components/PasswordSecurityRules'
import { PreValidationSignupStepProps } from 'features/auth/signup/types'
import { env } from 'libs/environment'
import { randomPassword } from 'libs/random'
import { BottomCardContentContainer } from 'ui/components/BottomCardContentContainer'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PasswordInput } from 'ui/components/inputs/PasswordInput'
import { Spacer } from 'ui/theme'

let INITIAL_PASSWORD = ''

if (__DEV__ && env.SIGNUP_RANDOM_PASSWORD) {
  INITIAL_PASSWORD = randomPassword()
}

export const SetPassword: FunctionComponent<PreValidationSignupStepProps> = (props) => {
  const [password, setPassword] = useState(INITIAL_PASSWORD)
  const disabled = !isPasswordCorrect(password)

  const passwordInput = useRef<RNTextInput | null>(null)

  function submitPassword() {
    if (!disabled) {
      props.goToNextStep({ password })
    }
  }

  return (
    <BottomCardContentContainer>
      <Spacer.Column numberOfSpaces={6} />
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
      <ButtonPrimary title={t`Continuer`} onPress={submitPassword} disabled={disabled} />
      <Spacer.Column numberOfSpaces={5} />
    </BottomCardContentContainer>
  )
}
