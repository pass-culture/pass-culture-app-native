import { yupResolver } from '@hookform/resolvers/yup'
import React, { FunctionComponent, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import styled from 'styled-components/native'

import { setPasswordSchema } from 'features/auth/pages/signup/SetPassword/schema/setPasswordSchema'
import { PreValidationSignupNormalStepProps } from 'features/auth/types'
import { PasswordInputController } from 'shared/forms/controllers/PasswordInputController'
import { Form } from 'ui/components/Form'
import { Button } from 'ui/designSystem/Button/Button'
import { Typo } from 'ui/theme'
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
      <PasswordInputContainer>
        <PasswordInputController
          control={control}
          name="password"
          autocomplete="current-password"
          label="Mot de passe"
          withSecurityRules
          securityRulesAlwaysVisible
        />
      </PasswordInputContainer>
      <ButtonPrimaryContainer>
        <Button
          variant="primary"
          wording="Continuer"
          accessibilityLabel={accessibilityLabelForNextStep}
          onPress={handleSubmit(onGoToNextStep)}
          disabled={!isValid}
          fullWidth
        />
      </ButtonPrimaryContainer>
    </Form.MaxWidth>
  )
}

const ButtonPrimaryContainer = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.l,
}))

const PasswordInputContainer = styled.View(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.xxxl,
}))
