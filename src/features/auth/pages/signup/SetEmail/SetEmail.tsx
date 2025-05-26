import { yupResolver } from '@hookform/resolvers/yup'
import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import styled, { useTheme } from 'styled-components/native'

import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { SSOButton } from 'features/auth/components/SSOButton/SSOButton'
import { setEmailSchema } from 'features/auth/pages/signup/SetEmail/schema/setEmailSchema'
import { PreValidationSignupNormalStepProps, SignInResponseFailure } from 'features/auth/types'
import { StepperOrigin, UseRouteType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { CheckboxController } from 'shared/forms/controllers/CheckboxController'
import { EmailInputController } from 'shared/forms/controllers/EmailInputController'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { SeparatorWithText } from 'ui/components/SeparatorWithText'
import { SNACK_BAR_TIME_OUT_LONG, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing, Typo } from 'ui/theme'
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
  const enableGoogleSSO = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_GOOGLE_SSO)
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
      <ControllersContainer>
        <EmailInputContainer>
          <EmailInputController
            control={control}
            name="email"
            onSpellingHelpPress={onLogHasCorrectedEmail}
          />
        </EmailInputContainer>
        <CheckboxController
          control={control}
          label="J’accepte de recevoir les newsletters, bons plans et les recommandations personnalisées du pass Culture."
          name="marketingEmailSubscription"
        />
      </ControllersContainer>
      <ButtonPrimary
        wording="Continuer"
        accessibilityLabel={accessibilityLabelForNextStep}
        onPress={handleSubmit(goToNextStepCallback)}
        isLoading={false}
        disabled={watch('email').trim() === ''}
      />

      {enableGoogleSSO ? (
        <SSOViewGap gap={4}>
          <StyledSeparatorWithText label="ou" />
          <SSOButton type="signup" onSignInFailure={onSSOSignInFailure} />
        </SSOViewGap>
      ) : (
        <EmptySpace />
      )}
      <AuthenticationButtonContainer>
        <AuthenticationButton
          type="login"
          onAdditionalPress={onLogAnalytics}
          linkColor={theme.colors.secondary}
          params={{ from: StepperOrigin.SIGNUP, offerId: params?.offerId }}
        />
      </AuthenticationButtonContainer>
    </Form.MaxWidth>
  )
}

const StyledSeparatorWithText = styled(SeparatorWithText).attrs(({ theme }) => ({
  backgroundColor: theme.colors.greyMedium,
}))``

const SSOViewGap = styled(ViewGap)({
  marginTop: getSpacing(4),
  marginBottom: getSpacing(10),
})

const ControllersContainer = styled.View({ marginVertical: getSpacing(10) })

const AuthenticationButtonContainer = styled.View({ marginBottom: getSpacing(5) })

const EmailInputContainer = styled.View({ marginBottom: getSpacing(8) })

const EmptySpace = styled.View({ height: getSpacing(8) })
