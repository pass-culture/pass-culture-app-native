import { yupResolver } from '@hookform/resolvers/yup'
import { useRoute } from '@react-navigation/native'
import { AxiosResponse } from 'axios'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Keyboard } from 'react-native'

import { SigninResponseV2 } from 'api/gen'
import { Captcha } from 'features/auth/components/Captcha'
import { LoginForm, LoginFormData } from 'features/auth/components/LoginForm'
import { useResetContexts } from 'features/auth/context/useResetContexts'
import { loginTriggeredActions, handleAccountState } from 'features/auth/helpers/loginCallbacks'
import { loginSchema } from 'features/auth/pages/login/schema/loginSchema'
import { useLoginMutation } from 'features/auth/queries/useLoginMutation'
import { useUserProfileInfoQuery } from 'features/auth/queries/useUserProfileInfoQuery.refacto'
import { SignInResponseFailure } from 'features/auth/types'
import { useCookies } from 'features/cookies/helpers/useCookies'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { ScreenPerformance } from 'performance/ScreenPerformance'
import { useMeasureScreenPerformanceWhenVisible } from 'performance/useMeasureScreenPerformanceWhenVisible'
import { useAddFavoriteMutation } from 'queries/favorites/useAddFavoriteMutation'
import { useBonificationBonusAmount, useIsRecaptchaEnabled } from 'queries/settings/useSettings'
import { SUGGESTION_DELAY_IN_MS } from 'ui/components/inputs/EmailInputWithSpellingHelp/useEmailSpellingHelp'
import { showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'
import { PageWithHeader } from 'ui/pages/PageWithHeader'

type LoginProps = { doNotNavigateOnSigninSuccess?: boolean }

export const Login = ({ doNotNavigateOnSigninSuccess }: LoginProps) => {
  useMeasureScreenPerformanceWhenVisible(ScreenPerformance.LOGIN)
  const { params } = useRoute<UseRouteType<'Login'>>()

  const offerId = params?.offerId
  const comeFrom = params?.from

  const [isDoingCaptchaChallenge, setIsDoingCaptchaChallenge] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { data: isCaptchaEnabled } = useIsRecaptchaEnabled()

  const { refetch } = useUserProfileInfoQuery(false)

  // FIXME(PC-00000): remove those contexts as well...
  const resetContexts = useResetContexts()
  const { setUserId: setUserIdToCookiesChoice } = useCookies()

  // Login Success
  const { data: subsidyBonusAmount } = useBonificationBonusAmount()

  const { mutate: addFavorite } = useAddFavoriteMutation({
    onSuccess: (data) =>
      data?.offer?.id &&
      void analytics.logHasAddedOfferToFavorites({ from: 'login', offerId: data.offer.id }),
  })

  const {
    handleSubmit,
    control,
    setFocus,
    setError: setFormErrors,
    formState: { isValid },
    getValues,
  } = useForm<LoginFormData>({
    mode: 'all',
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    delayError: SUGGESTION_DELAY_IN_MS,
  })

  const handleLoginFailure = (response: SignInResponseFailure) => {
    const failureCode = response.content?.code
    setFocus('email')
    if (failureCode === 'EMAIL_NOT_VALIDATED') {
      const email = getValues('email')?.trim()
      if (!email) {
        setErrorMessage('Impossible de recuperer ton adresse e-mail. Reessaie.')
        return
      }
      navigateFromRef('SignupConfirmationEmailSent', { email })
    } else if (failureCode === 'ACCOUNT_DELETED') {
      setFormErrors('email', { message: 'Cette adresse e-mail est liée à un compte supprimé' })
    } else if (failureCode === 'NETWORK_REQUEST_FAILED') {
      setErrorMessage('Erreur réseau. Tu peux réessayer une fois la connexion réétablie')
    } else if (response.statusCode === 429 || failureCode === 'TOO_MANY_ATTEMPTS') {
      setErrorMessage('Nombre de tentatives dépassé. Réessaye dans 1 minute')
    } else {
      setErrorMessage('E-mail ou mot de passe incorrect')
    }
  }

  const handleLoginSuccess = async (response: AxiosResponse<SigninResponseV2>) => {
    void analytics.logLogin({ method: 'fromLogin', type: 'email_login' })
    await loginTriggeredActions(response.data, setUserIdToCookiesChoice, resetContexts)

    if (doNotNavigateOnSigninSuccess) {
      return
    }
    await handleAccountState(
      response.data.accountState,
      offerId,
      comeFrom,
      subsidyBonusAmount,
      addFavorite,
      refetch,
      setErrorMessage
    )
  }

  const { mutate: signIn, isPending } = useLoginMutation({
    onSuccess: handleLoginSuccess,
    onFailure: handleLoginFailure,
  })

  const isLoginButtonDisabled = !isValid || isPending || isDoingCaptchaChallenge

  const openCaptchaChallenge = () => {
    setIsDoingCaptchaChallenge(true)
    setErrorMessage(null)
  }

  const onSubmit = async (data: LoginFormData) => {
    if (isLoginButtonDisabled) return

    setErrorMessage('')
    Keyboard.dismiss()
    isCaptchaEnabled
      ? openCaptchaChallenge()
      : signIn({ identifier: data.email, password: data.password })
  }

  useEffect(() => {
    if (params?.from) void analytics.logStepperDisplayed(params.from, 'Login')
  }, [params?.from])

  useEffect(() => {
    if (params?.displayForcedLoginHelpMessage) {
      showErrorSnackBar(
        'Pour sécuriser ton pass Culture, tu dois régulièrement confirmer tes identifiants.'
      )
      void analytics.logDisplayForcedLoginHelpMessage()
    }
  }, [params?.displayForcedLoginHelpMessage])

  return (
    <React.Fragment>
      {isCaptchaEnabled ? (
        <Captcha
          setIsDoingCaptchaChallenge={setIsDoingCaptchaChallenge}
          setErrorMessage={setErrorMessage}
          onRecaptchaSuccess={(token) =>
            handleSubmit((data) =>
              signIn({ identifier: data.email, password: data.password, token })
            )
          }
          isDoingCaptchaChallenge
          isRecaptchaEnabled
        />
      ) : null}
      <PageWithHeader
        shouldLimitWidth
        shouldDisplayBackButton
        title="Connexion"
        scrollChildren={
          <LoginForm
            errorMessage={errorMessage}
            control={control}
            onSubmit={() => handleSubmit(onSubmit)}
            onForgottenPassword={() => navigateFromRef('ForgottenPassword')}
            isLoginButtonDisabled={isLoginButtonDisabled}
          />
        }
      />
    </React.Fragment>
  )
}
