import { yupResolver } from '@hookform/resolvers/yup'
import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useCallback, useEffect } from 'react'
import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  useForm,
  UseFormStateReturn,
} from 'react-hook-form'
import { useTheme } from 'styled-components/native'

import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { setEmailSchema } from 'features/auth/pages/signup/SetEmail/schema/setEmailSchema'
import { PreValidationSignupNormalStepProps } from 'features/auth/types'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
// eslint-disable-next-line no-restricted-imports
import { firebaseAnalytics } from 'libs/firebase/analytics'
import { EmailInputController } from 'shared/forms/controllers/EmailInputController'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { Form } from 'ui/components/Form'
import { Checkbox } from 'ui/components/inputs/Checkbox/Checkbox'
import { Separator } from 'ui/components/Separator'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Spacer } from 'ui/theme'
import { CaptionNeutralInfo, Typo } from 'ui/theme/typography'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

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

export const SetEmail: FunctionComponent<PreValidationSignupNormalStepProps> = ({
  goToNextStep,
  accessibilityLabelForNextStep,
}) => {
  const { params } = useRoute<UseRouteType<'SignupForm'>>()
  const theme = useTheme()
  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      email: '',
      marketingEmailSubscription: false,
    },
    resolver: yupResolver(setEmailSchema),
    mode: 'onSubmit',
  })

  const onLogAnalytics = useCallback(() => {
    firebaseAnalytics.logLogin({ method: 'fromSetEmail' })
  }, [])

  const goToNextStepCallback = useCallback(
    ({ email, marketingEmailSubscription }: FormValues) => {
      goToNextStep({ email, marketingEmailSubscription })
    },
    [goToNextStep]
  )

  const onLogHasCorrectedEmail = useCallback(() => {
    analytics.logHasCorrectedEmail({ from: 'setemail' })
  }, [])

  useEffect(() => {
    analytics.logScreenViewSetEmail()
  }, [])

  return (
    <Form.MaxWidth>
      <Typo.Title3 {...getHeadingAttrs(2)}>Crée-toi un compte</Typo.Title3>
      <Spacer.Column numberOfSpaces={10} />
      <EmailInputController
        control={control}
        name="email"
        label="Adresse e-mail"
        withSpellingHelp
        onSpellingHelpPress={onLogHasCorrectedEmail}
        autoFocus
      />
      <Spacer.Column numberOfSpaces={8} />
      <Controller
        control={control}
        name="marketingEmailSubscription"
        render={NewsletterCheckboxControlled}
      />
      <Spacer.Column numberOfSpaces={10} />
      <Separator />
      <Spacer.Column numberOfSpaces={8} />
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
        numberOfLines={2}
        inline
      />
      <Spacer.Column numberOfSpaces={10} />
      <ButtonPrimary
        wording="Continuer"
        accessibilityLabel={accessibilityLabelForNextStep}
        onPress={handleSubmit(goToNextStepCallback)}
        isLoading={false}
        disabled={watch('email').trim() === ''}
      />
      <Spacer.Column numberOfSpaces={8} />
      <AuthenticationButton
        type="login"
        onAdditionalPress={onLogAnalytics}
        linkColor={theme.colors.secondary}
        params={{ offerId: params?.offerId, preventCancellation: true }}
      />
      <Spacer.Column numberOfSpaces={5} />
    </Form.MaxWidth>
  )
}
