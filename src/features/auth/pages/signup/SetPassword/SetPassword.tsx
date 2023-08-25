import { yupResolver } from '@hookform/resolvers/yup'
import React, { FunctionComponent, useCallback } from 'react'
import { useForm } from 'react-hook-form'

import { setPasswordSchema } from 'features/auth/pages/signup/SetPassword/schema/setPasswordSchema'
import { PreValidationSignupNormalStepProps } from 'features/auth/types'
import { PasswordInputController } from 'shared/forms/controllers/PasswordInputController'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type FormValues = {
  password: string
}

export const SetPassword: FunctionComponent<PreValidationSignupNormalStepProps> = ({
  goToNextStep,
  accessibilityLabelForNextStep,
}) => {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormValues>({
    defaultValues: { password: '' },
    resolver: yupResolver(setPasswordSchema),
    mode: 'onChange',
  })

  const onGoToNextStep = useCallback(
    ({ password }: FormValues) => {
      goToNextStep({ password })
    },
    [goToNextStep]
  )

  return (
    <Form.MaxWidth>
      <Typo.Title3 {...getHeadingAttrs(2)}>Choisis un mot de passe</Typo.Title3>
      <Spacer.Column numberOfSpaces={10} />
      <PasswordInputController
        control={control}
        name="password"
        label="Mot de passe"
        placeholder="Ton mot de passe"
        withSecurityRules
        securityRulesAlwaysVisible
        autoFocus
        nativeAutoFocus
      />
      <Spacer.Column numberOfSpaces={10} />
      <ButtonPrimary
        wording="Continuer"
        accessibilityLabel={accessibilityLabelForNextStep}
        onPress={handleSubmit(onGoToNextStep)}
        disabled={!isValid}
      />
      <Spacer.Column numberOfSpaces={5} />
    </Form.MaxWidth>
  )
}
