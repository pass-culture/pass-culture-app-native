import { yupResolver } from '@hookform/resolvers/yup'
import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useCallback } from 'react'
import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  useForm,
  UseFormStateReturn,
} from 'react-hook-form'

import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { setEmailSchema } from 'features/auth/pages/signup/SetEmail/schema/setEmailSchema'
import { PreValidationSignupStepProps } from 'features/auth/types'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { env } from 'libs/environment'
import { analytics } from 'libs/firebase/analytics'
import { EmailInputController } from 'shared/forms/controllers/EmailInputController'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { Form } from 'ui/components/Form'
import { Checkbox } from 'ui/components/inputs/Checkbox/Checkbox'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Spacer } from 'ui/theme'
import { CaptionNeutralInfo } from 'ui/theme/typography'

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
  const { params } = useRoute<UseRouteType<'SignupForm'>>()
  const { control, handleSubmit, watch } = useForm<FormValues>({
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

  const onLogHasCorrectedEmail = useCallback(() => {
    analytics.logHasCorrectedEmail({ from: 'setemail' })
  }, [])

  return (
    <Form.MaxWidth>
      <EmailInputController
        control={control}
        name="email"
        label="Adresse e-mail"
        withSpellingHelp
        onSpellingHelpPress={onLogHasCorrectedEmail}
        autoFocus
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
      <AuthenticationButton
        type="login"
        onAdditionalPress={onLogAnalytics}
        params={{ offerId: params?.offerId, preventCancellation: true }}
      />
      <Spacer.Column numberOfSpaces={6} />
      <CaptionNeutralInfo>
        Le pass Culture traite tes données pour la gestion de ton compte et pour l’inscription à la
        newsletter.
      </CaptionNeutralInfo>
      <Spacer.Column numberOfSpaces={2} />
      <ExternalTouchableLink
        as={ButtonQuaternaryBlack}
        externalNav={{ url: env.FAQ_LINK_PERSONAL_DATA }}
        wording="Comment gérer tes données personnelles&nbsp;?"
        icon={ExternalSiteFilled}
        justifyContent="flex-start"
        inline
      />
      <Spacer.Column numberOfSpaces={4} />
    </Form.MaxWidth>
  )
}
