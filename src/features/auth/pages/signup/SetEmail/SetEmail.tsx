import { yupResolver } from '@hookform/resolvers/yup'
import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'
import { useTheme } from 'styled-components/native'

import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { SSOButton } from 'features/auth/components/SSOButton/SSOButton'
import { setEmailSchema } from 'features/auth/pages/signup/SetEmail/schema/setEmailSchema'
import { PreValidationSignupNormalStepProps, SignInResponseFailure } from 'features/auth/types'
import { StepperOrigin, UseRouteType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import { CheckboxController } from 'shared/forms/controllers/CheckboxController'
import { EmailInputController } from 'shared/forms/controllers/EmailInputController'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { SeparatorWithText } from 'ui/components/SeparatorWithText'
import { SNACK_BAR_TIME_OUT_LONG, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Spacer } from 'ui/theme'
import { Typo } from 'ui/theme/typography'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type FormValues = {
  email: string
  marketingEmailSubscription: boolean
}

export const SetEmail: FunctionComponent<PreValidationSignupNormalStepProps> = ({
  goToNextStep,
  accessibilityLabelForNextStep,
  previousSignupData,
  onSSOEmailNotFoundError,
  onDefaultEmailSignup,
}) => {
  const { showErrorSnackBar } = useSnackBarContext()

  const { params } = useRoute<UseRouteType<'SignupForm'>>()
  const theme = useTheme()
  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      email: previousSignupData.email,
      marketingEmailSubscription: previousSignupData.marketingEmailSubscription ?? false,
    },
    resolver: yupResolver(setEmailSchema),
    mode: 'onSubmit',
  })

  const onLogAnalytics = useCallback(() => {
    analytics.logLoginClicked({ from: 'SetEmail' })
  }, [])

  const goToNextStepCallback = useCallback(
    ({ email, marketingEmailSubscription }: FormValues) => {
      onDefaultEmailSignup()
      goToNextStep({ email, marketingEmailSubscription })
    },
    [goToNextStep, onDefaultEmailSignup]
  )

  const onLogHasCorrectedEmail = useCallback(() => {
    analytics.logHasCorrectedEmail({ from: 'setemail' })
  }, [])

  useEffect(() => {
    analytics.logScreenViewSetEmail()
  }, [])

  const onSSOSignInFailure = useCallback(
    (errorResponse: SignInResponseFailure) => {
      if (errorResponse.content?.code === 'SSO_EMAIL_NOT_FOUND') {
        onSSOEmailNotFoundError()
        goToNextStep({ accountCreationToken: errorResponse.content.accountCreationToken })
      } else {
        showErrorSnackBar({
          message:
            'Ton compte Google semble ne pas être valide. Pour pouvoir t’inscrire, confirme d’abord ton adresse e-mail Google.',
          timeout: SNACK_BAR_TIME_OUT_LONG,
        })
      }
    },
    [goToNextStep, onSSOEmailNotFoundError, showErrorSnackBar]
  )

  return (
    <Form.MaxWidth>
      <Typo.Title3 {...getHeadingAttrs(2)}>Crée-toi un compte</Typo.Title3>
      <Spacer.Column numberOfSpaces={10} />
      <EmailInputController
        control={control}
        name="email"
        onSpellingHelpPress={onLogHasCorrectedEmail}
      />
      <Spacer.Column numberOfSpaces={8} />
      <CheckboxController
        control={control}
        label="J’accepte de recevoir les newsletters, bons plans et les recommandations personnalisées du pass Culture."
        name="marketingEmailSubscription"
      />
      <Spacer.Column numberOfSpaces={10} />
      <ButtonPrimary
        wording="Continuer"
        accessibilityLabel={accessibilityLabelForNextStep}
        onPress={handleSubmit(goToNextStepCallback)}
        isLoading={false}
        disabled={watch('email').trim() === ''}
      />
      <Spacer.Column numberOfSpaces={4} />
      <StyledSeparatorWithText label="ou" />
      <Spacer.Column numberOfSpaces={4} />
      <SSOButton type="signup" onSignInFailure={onSSOSignInFailure} />
      <Spacer.Column numberOfSpaces={10} />
      <AuthenticationButton
        type="login"
        onAdditionalPress={onLogAnalytics}
        linkColor={theme.colors.secondary}
        params={{ from: StepperOrigin.SIGNUP, offerId: params?.offerId }}
      />
      <Spacer.Column numberOfSpaces={5} />
    </Form.MaxWidth>
  )
}

const StyledSeparatorWithText = styled(SeparatorWithText).attrs(({ theme }) => ({
  backgroundColor: theme.colors.greyMedium,
}))``
