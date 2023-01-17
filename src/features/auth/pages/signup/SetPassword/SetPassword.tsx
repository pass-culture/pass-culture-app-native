import React, { FunctionComponent, useCallback, useRef, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'
import { v4 as uuidv4 } from 'uuid'

import {
  isPasswordCorrect,
  PasswordSecurityRules,
} from 'features/auth/components/PasswordSecurityRules'
import { PreValidationSignupStepProps } from 'features/auth/types'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { PasswordInput } from 'ui/components/inputs/PasswordInput'
import { Spacer } from 'ui/theme'

export const SetPassword: FunctionComponent<PreValidationSignupStepProps> = (props) => {
  const [password, setPassword] = useState('')
  const disabled = !isPasswordCorrect(password)

  const passwordInput = useRef<RNTextInput | null>(null)
  const passwordDescribedBy = uuidv4()

  const submitPassword = useCallback(() => {
    if (!disabled) {
      props.goToNextStep({ password })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, password, props.goToNextStep])

  return (
    <Form.MaxWidth>
      <PasswordInput
        autoFocus
        nativeAutoFocus
        accessibilityDescribedBy={passwordDescribedBy}
        value={password}
        onChangeText={setPassword}
        onSubmitEditing={submitPassword}
        ref={passwordInput}
      />
      <PasswordSecurityRules password={password} nativeID={passwordDescribedBy} />
      <Spacer.Column numberOfSpaces={6} />
      <ButtonPrimary
        wording="Continuer"
        accessibilityLabel={props.accessibilityLabelForNextStep}
        onPress={submitPassword}
        disabled={disabled}
      />
      <Spacer.Column numberOfSpaces={5} />
    </Form.MaxWidth>
  )
}
