import { yupResolver } from '@hookform/resolvers/yup'
import React, { FunctionComponent, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import styled from 'styled-components/native'

import { setEmailSchema } from 'features/auth/pages/signup/SetEmail/schema/setEmailSchema'
import { PreValidationSignupNormalStepProps } from 'features/auth/types'
import { analytics } from 'libs/analytics/provider'
import { CheckboxController } from 'shared/forms/controllers/CheckboxController'
import { EmailInputController } from 'shared/forms/controllers/EmailInputController'
import { Form } from 'ui/components/Form'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type FormValues = { email: string; marketingEmailSubscription: boolean }

export const SetEmail: FunctionComponent<PreValidationSignupNormalStepProps> = ({
  goToNextStep,
  accessibilityLabelForNextStep,
  previousSignupData,
  onDefaultEmailSignup,
}) => {
  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      email: previousSignupData.email,
      marketingEmailSubscription: previousSignupData.marketingEmailSubscription ?? false,
    },
    resolver: yupResolver(setEmailSchema),
    mode: 'onSubmit',
  })

  const goToNextStepCallback = useCallback(
    ({ email, marketingEmailSubscription }: FormValues) => {
      onDefaultEmailSignup()
      goToNextStep({ email, marketingEmailSubscription })
    },
    [goToNextStep, onDefaultEmailSignup]
  )

  const onLogHasCorrectedEmail = useCallback(() => {
    void analytics.logHasCorrectedEmail({ from: 'setemail' })
  }, [])

  const disabled = watch('email').trim() === ''

  return (
    <Form.MaxWidth>
      <Typo.Title3 {...getHeadingAttrs(2)}>Crée-toi un compte</Typo.Title3>
      <ControllersContainer gap={5}>
        <EmailInputController
          label="Adresse e-mail"
          control={control}
          name="email"
          onSpellingHelpPress={onLogHasCorrectedEmail}
        />
        <CheckboxController
          control={control}
          label="J’accepte de recevoir les newsletters, bons plans et les recommandations personnalisées du pass Culture."
          name="marketingEmailSubscription"
        />
      </ControllersContainer>
      <Button
        fullWidth
        wording="Continuer"
        accessibilityLabel={accessibilityLabelForNextStep}
        onPress={handleSubmit(goToNextStepCallback)}
        isLoading={false}
        disabled={disabled}
      />
    </Form.MaxWidth>
  )
}

const ControllersContainer = styled(ViewGap)(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.xl,
}))
