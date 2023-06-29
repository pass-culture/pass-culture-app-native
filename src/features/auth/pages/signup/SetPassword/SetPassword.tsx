import { yupResolver } from '@hookform/resolvers/yup'
import React, { FunctionComponent, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import styled from 'styled-components/native'

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

export const SetPassword: FunctionComponent<PreValidationSignupNormalStepProps> = (props) => {
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
      <StyledTitle3>Choisis un mot de passe</StyledTitle3>
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
        accessibilityLabel={props.accessibilityLabelForNextStep}
        onPress={handleSubmit(goToNextStep)}
        disabled={!isValid}
      />
      <Spacer.Column numberOfSpaces={5} />
    </Form.MaxWidth>
  )
}

const StyledTitle3 = styled(Typo.Title3).attrs({
  ...getHeadingAttrs(2),
})``
