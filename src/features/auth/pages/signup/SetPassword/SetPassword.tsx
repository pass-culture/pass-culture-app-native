import { yupResolver } from '@hookform/resolvers/yup'
import React, { FunctionComponent, useCallback } from 'react'
import { useForm } from 'react-hook-form'

import { setPasswordSchema } from 'features/auth/pages/signup/SetPassword/schema/setPasswordSchema'
import { PreValidationSignupStepProps } from 'features/auth/types'
import { PasswordInputController } from 'shared/forms/controllers/PasswordInputController'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { Spacer } from 'ui/theme'

type FormValues = {
  password: string
}

export const SetPassword: FunctionComponent<PreValidationSignupStepProps> = (props) => {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormValues>({
    defaultValues: {
      password: '',
    },
    resolver: yupResolver(setPasswordSchema),
    mode: 'onChange',
  })

  const goToNextStep = useCallback(
    ({ password }) => {
      props.goToNextStep({ password })
    },
    [props]
  )

  return (
    <Form.MaxWidth>
      <PasswordInputController
        control={control}
        name={'password'}
        label="Mot de passe"
        placeholder="Ton mot de passe"
        isRequiredField
        withSecurityRules
        securityRulesAlwaysVisible
        autoFocus
        nativeAutoFocus
      />
      <Spacer.Column numberOfSpaces={6} />
      <ButtonPrimary
        wording="Continuer"
        accessibilityLabel={props.accessibilityLabelForNextStep}
        onPress={handleSubmit(goToNextStep)}
        disabled={!isValid}
      />
      <Spacer.Column numberOfSpaces={5} />
    </Form.MaxWidth>
  )
}
