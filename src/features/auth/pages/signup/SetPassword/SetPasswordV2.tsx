import { yupResolver } from '@hookform/resolvers/yup'
import React, { FunctionComponent, useCallback } from 'react'
import { useForm } from 'react-hook-form'

import { setPasswordSchema } from 'features/auth/pages/signup/SetPassword/schema/setPasswordSchema'
import { PreValidationSignupNormalStepProps } from 'features/auth/types'
import { PasswordInputController } from 'shared/forms/controllers/PasswordInputController'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { Spacer, Typo } from 'ui/theme'

type FormValues = {
  password: string
}

export const SetPasswordV2: FunctionComponent<PreValidationSignupNormalStepProps> = (props) => {
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
    ({ password }: FormValues) => {
      props.goToNextStep({ password })
    },
    [props]
  )

  return (
    <Form.MaxWidth>
      <Typo.Title3>Mot de passe</Typo.Title3>
      <Spacer.Column numberOfSpaces={6} />
      <PasswordInputController
        control={control}
        name="password"
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
