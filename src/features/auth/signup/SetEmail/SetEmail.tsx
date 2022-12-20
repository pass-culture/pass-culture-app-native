import { yupResolver } from '@hookform/resolvers/yup'
import React, { FunctionComponent, useCallback } from 'react'
import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  useForm,
  UseFormStateReturn,
} from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'

import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { setEmailSchema } from 'features/auth/signup/SetEmail/schema/setEmailSchema'
import { analytics } from 'libs/firebase/analytics'
import { EmailInputController } from 'shared/forms/controllers/EmailInputController'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { Checkbox } from 'ui/components/inputs/Checkbox/Checkbox'
import { InputError } from 'ui/components/inputs/InputError'
import { Spacer } from 'ui/theme'

import { PreValidationSignupStepProps } from '../types'

const emailInputErrorId = uuidv4()

type FormValues = {
  email: string
  marketingEmailSubscription: boolean
}

type InputControlled<fieldName extends keyof FormValues> = {
  field: ControllerRenderProps<FormValues, fieldName>
  fieldState: ControllerFieldState
  formState: UseFormStateReturn<FormValues>
}

const NewsletterCheckboxControlled = ({
  field: { value, onChange },
}: InputControlled<'marketingEmailSubscription'>) => (
  <Checkbox
    isChecked={value}
    label="J’accepte de recevoir les newsletters, bons plans et recommandations personnalisées du pass Culture."
    onPress={onChange}
  />
)

export const SetEmail: FunctionComponent<PreValidationSignupStepProps> = (props) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      email: '',
      marketingEmailSubscription: false,
    },
    resolver: yupResolver(setEmailSchema),
    mode: 'onSubmit',
  })

  const onLogAnalytics = useCallback(() => {
    analytics.logLogin({ method: 'fromSetEmail' })
  }, [])

  const goToNextStep = useCallback(
    ({ email, marketingEmailSubscription }) => {
      props.goToNextStep({ email, marketingEmailSubscription })
    },
    [props]
  )

  return (
    <Form.MaxWidth>
      <EmailInputController
        control={control}
        name="email"
        label="Adresse e-mail"
        autoFocus
        emailInputErrorId={emailInputErrorId}
      />
      <InputError
        visible={!!errors.email}
        messageId={errors.email?.message}
        numberOfSpacesTop={2}
        relatedInputId={emailInputErrorId}
      />
      <Spacer.Column numberOfSpaces={4} />
      <Controller
        control={control}
        name="marketingEmailSubscription"
        render={NewsletterCheckboxControlled}
      />
      <Spacer.Column numberOfSpaces={6} />
      <ButtonPrimary
        wording="Continuer"
        accessibilityLabel={props.accessibilityLabelForNextStep}
        onPress={handleSubmit(goToNextStep)}
        isLoading={false}
        disabled={watch('email').trim() === ''}
      />
      <Spacer.Column numberOfSpaces={8} />
      <AuthenticationButton type="login" onAdditionalPress={onLogAnalytics} />
      <Spacer.Column numberOfSpaces={4} />
    </Form.MaxWidth>
  )
}
