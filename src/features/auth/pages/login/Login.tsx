import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { FunctionComponent, memo, useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Keyboard } from 'react-native'
import styled from 'styled-components/native'

import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { SSOButtonBase } from 'features/auth/components/SSOButton/SSOButtonBase'
import { useSettingsContext } from 'features/auth/context/SettingsContext'
import { loginSchema } from 'features/auth/pages/login/schema/loginSchema'
import { useSignInMutation } from 'features/auth/queries/useSignInMutation'
import { SignInResponseFailure } from 'features/auth/types'
import {
  StepperOrigin,
  UseNavigationType,
  UseRouteType,
} from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useSafeState } from 'libs/hooks'
import { captureMonitoringError } from 'libs/monitoring/errors'
import { ReCaptchaError, ReCaptchaInternalError } from 'libs/recaptcha/errors'
import { ReCaptcha } from 'libs/recaptcha/ReCaptcha'
import { ScreenPerformance } from 'performance/ScreenPerformance'
import { useMeasureScreenPerformanceWhenVisible } from 'performance/useMeasureScreenPerformanceWhenVisible'
import { EmailInputController } from 'shared/forms/controllers/EmailInputController'
import { PasswordInputController } from 'shared/forms/controllers/PasswordInputController'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { Form } from 'ui/components/Form'
import { SUGGESTION_DELAY_IN_MS } from 'ui/components/inputs/EmailInputWithSpellingHelp/useEmailSpellingHelp'
import { InputError } from 'ui/components/inputs/InputError'
import { SeparatorWithText } from 'ui/components/SeparatorWithText'
import { SNACK_BAR_TIME_OUT_LONG, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { Key } from 'ui/svg/icons/Key'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type LoginFormData = {
  email: string
  password: string
}

type Props = {
  doNotNavigateOnSigninSuccess?: boolean
}

export const Login: FunctionComponent<Props> = memo(function Login(props) {
  useMeasureScreenPerformanceWhenVisible(ScreenPerformance.LOGIN)
  const enableGoogleSSO = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_GOOGLE_SSO)
  const { data: settings } = useSettingsContext()
  const { params } = useRoute<UseRouteType<'Login'>>()
  const { navigate } = useNavigation<UseNavigationType>()
  const { showInfoSnackBar, showErrorSnackBar } = useSnackBarContext()
  const [isDoingReCaptchaChallenge, setIsDoingReCaptchaChallenge] = useState(false)
  const isRecaptchaEnabled = settings?.isRecaptchaEnabled

  const {
    handleSubmit,
    control,
    watch,
    setFocus,
    setError: setFormErrors,
    formState: { isValid },
  } = useForm<LoginFormData>({
    mode: 'all',
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    delayError: SUGGESTION_DELAY_IN_MS,
  })
  const email = watch('email')

  const [errorMessage, setErrorMessage] = useSafeState<string | null>(null)

  useEffect(() => {
    if (params?.from) {
      analytics.logStepperDisplayed(params.from, 'Login')
    }
  }, [params?.from])

  useEffect(() => {
    if (params?.displayForcedLoginHelpMessage) {
      showInfoSnackBar({
        message:
          'Pour sécuriser ton pass Culture, tu dois régulièrement confirmer tes identifiants.',
        timeout: SNACK_BAR_TIME_OUT_LONG,
      })
      analytics.logDisplayForcedLoginHelpMessage()
    }
  }, [params?.displayForcedLoginHelpMessage, showInfoSnackBar])

  const handleSigninFailure = useCallback(
    (response: SignInResponseFailure) => {
      const failureCode = response.content?.code
      setFocus('email')
      if (failureCode === 'SSO_EMAIL_NOT_FOUND') {
        navigate('SignupForm', {
          accountCreationToken: response.content?.accountCreationToken,
          email: response.content?.email,
          from: StepperOrigin.LOGIN,
        })
      } else if (
        failureCode &&
        [
          'DUPLICATE_GOOGLE_ACCOUNT',
          'SSO_ACCOUNT_DELETED',
          'SSO_ACCOUNT_ANONYMIZED',
          'SSO_EMAIL_NOT_VALIDATED',
        ].includes(failureCode)
      ) {
        showErrorSnackBar({
          message:
            'Ton compte Google semble ne pas être valide. Pour pouvoir te connecter, confirme d’abord ton adresse e-mail Google.',
          timeout: SNACK_BAR_TIME_OUT_LONG,
        })
      } else if (failureCode === 'EMAIL_NOT_VALIDATED') {
        navigate('SignupConfirmationEmailSent', { email })
      } else if (failureCode === 'ACCOUNT_DELETED') {
        setFormErrors('email', { message: 'Cette adresse e-mail est liée à un compte supprimé' })
      } else if (failureCode === 'NETWORK_REQUEST_FAILED') {
        setErrorMessage('Erreur réseau. Tu peux réessayer une fois la connexion réétablie')
      } else if (response.statusCode === 429 || failureCode === 'TOO_MANY_ATTEMPTS') {
        setErrorMessage('Nombre de tentatives dépassé. Réessaye dans 1 minute')
      } else {
        setErrorMessage('E-mail ou mot de passe incorrect')
      }
    },
    [setFocus, navigate, showErrorSnackBar, email, setFormErrors, setErrorMessage]
  )

  const { mutate: signIn, isPending } = useSignInMutation({
    doNotNavigateOnSigninSuccess: props.doNotNavigateOnSigninSuccess,
    params,
    setErrorMessage,
    onFailure: handleSigninFailure,
  })

  const shouldDisableLoginButton = !isValid || isPending || isDoingReCaptchaChallenge

  const openReCaptchaChallenge = useCallback(() => {
    setIsDoingReCaptchaChallenge(true)
    setErrorMessage(null)
  }, [setErrorMessage])

  const onReCaptchaClose = useCallback(() => {
    setIsDoingReCaptchaChallenge(false)
  }, [])

  const onReCaptchaError = useCallback(
    (errorCode: ReCaptchaError, error?: string | undefined) => {
      setIsDoingReCaptchaChallenge(false)
      if (errorCode === ReCaptchaInternalError.NetworkError) {
        setErrorMessage(
          'Un problème est survenu, vérifie ta connexion internet avant de rééssayer.'
        )
      } else {
        setErrorMessage('Un problème est survenu, réessaie plus tard.')
        captureMonitoringError(`${errorCode} ${error ?? 'EMPTY_ERROR'}`, 'LoginOnRecaptchaError')
      }
    },
    [setErrorMessage]
  )

  const onReCaptchaExpire = useCallback(() => {
    setIsDoingReCaptchaChallenge(false)
    setErrorMessage('Le token reCAPTCHA a expiré, tu peux réessayer.')
  }, [setErrorMessage])

  const onReCaptchaSuccess = useCallback(
    (token: string) => {
      setIsDoingReCaptchaChallenge(false)
      handleSubmit((data) => signIn({ identifier: data.email, password: data.password, token }))()
    },
    [handleSubmit, signIn]
  )

  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      if (!shouldDisableLoginButton) {
        setErrorMessage('')
        Keyboard.dismiss()
        isRecaptchaEnabled
          ? openReCaptchaChallenge()
          : signIn({ identifier: data.email, password: data.password })
      }
    },
    [shouldDisableLoginButton, isRecaptchaEnabled, setErrorMessage, openReCaptchaChallenge, signIn]
  )

  const onForgottenPasswordClick = useCallback(() => {
    navigate('ForgottenPassword')
  }, [navigate])

  const onLogSignUpAnalytics = useCallback(() => {
    analytics.logSignUpClicked({ from: 'login' })
  }, [])

  const titlePage = 'Connecte-toi'

  return (
    <React.Fragment>
      {isRecaptchaEnabled ? (
        <ReCaptcha
          onClose={onReCaptchaClose}
          onError={onReCaptchaError}
          onExpire={onReCaptchaExpire}
          onSuccess={onReCaptchaSuccess}
          isVisible={isDoingReCaptchaChallenge}
        />
      ) : null}
      <SecondaryPageWithBlurHeader title="Connexion" shouldDisplayBackButton>
        <TitleContainer>
          <Typo.Title3 {...getHeadingAttrs(2)}>{titlePage}</Typo.Title3>
        </TitleContainer>
        <Form.MaxWidth>
          <InputError
            visible={!!errorMessage}
            errorMessage={errorMessage}
            numberOfSpacesTop={5}
            centered
          />
          <Container>
            <EmailInputController
              label="Adresse e-mail"
              name="email"
              control={control}
              requiredIndicator="explicit"
            />
          </Container>
          <PasswordInputController
            name="password"
            control={control}
            onSubmitEditing={handleSubmit(onSubmit)}
            requiredIndicator="explicit"
          />
          <ButtonContainer>
            <ButtonTertiaryBlack
              wording="Mot de passe oublié&nbsp;?"
              onPress={onForgottenPasswordClick}
              icon={Key}
              inline
            />
          </ButtonContainer>
          <ButtonPrimary
            wording="Se connecter"
            onPress={handleSubmit(onSubmit)}
            disabled={shouldDisableLoginButton}
          />
          {enableGoogleSSO ? (
            <StyledViewGap gap={4}>
              <SeparatorWithText label="ou" />
              <SSOButtonBase type="login" onSuccess={signIn} />
            </StyledViewGap>
          ) : (
            <NoSSOSpace />
          )}
        </Form.MaxWidth>
        <SignUpButton type="signup" onAdditionalPress={onLogSignUpAnalytics} />
      </SecondaryPageWithBlurHeader>
    </React.Fragment>
  )
})

const ButtonContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  width: '100%',
  maxWidth: theme.buttons.maxWidth,
  marginTop: theme.designSystem.size.spacing.l,
  marginBottom: theme.designSystem.size.spacing.xxl,
}))

const Container = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xl,
  marginBottom: theme.designSystem.size.spacing.xl,
}))

const SignUpButton = styled(AuthenticationButton).attrs(({ theme }) => ({
  linkColor: theme.designSystem.color.text.brandSecondary,
  type: 'signup',
}))``

const TitleContainer = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.s,
}))

const StyledViewGap = styled(ViewGap)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
  marginBottom: theme.designSystem.size.spacing.xxxl,
}))

const NoSSOSpace = styled.View(({ theme }) => ({ height: theme.designSystem.size.spacing.xxl }))
