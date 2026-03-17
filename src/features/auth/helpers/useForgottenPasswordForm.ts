import { useNavigation } from '@react-navigation/native'
import { useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'

import { api } from 'api/api'
import { ApiError } from 'api/ApiError'
import { isAPIExceptionCapturedAsInfo } from 'api/apiHelpers'
import { StepperOrigin, UseNavigationType } from 'features/navigation/RootNavigator/types'
import { captureMonitoringError } from 'libs/monitoring/errors'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { ReCaptchaError } from 'libs/recaptcha/errors'
import { isEmailValid } from 'ui/components/inputs/emailCheck'
import { isValueEmpty } from 'ui/components/inputs/helpers'

type FormValues = {
  email: string
  isFetching: boolean
  isDoingReCaptchaChallenge: boolean
  network: void
  reCaptcha: void
}

export const useForgottenPasswordForm = (isRecaptchaEnabled: boolean) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const {
    control,
    setError,
    clearErrors,
    setValue,
    watch,
    setFocus,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { email: '', isFetching: false, isDoingReCaptchaChallenge: false },
  })
  const { email, isFetching, isDoingReCaptchaChallenge } = watch()

  // Little helper method to make it easier to set error
  const setCustomError = useCallback(
    (message: string) => {
      setFocus('email')
      return setError('email', { type: 'custom', message })
    },
    [setError, setFocus]
  )

  const onConnection = useCallback(clearErrors, [clearErrors])
  const onConnectionLost = useCallback(() => {
    setCustomError('Hors connexion\u00a0: en attente du réseau.')
    setValue('isDoingReCaptchaChallenge', false)
  }, [setCustomError, setValue])

  const networkInfo = useNetInfoContext({
    onConnection,
    onConnectionLost,
  })
  const { replace } = useNavigation<UseNavigationType>()

  /**
   * Called after recaptcha test, or if recaptcha not needed.
   *
   * @param {string} token Initialized with `dummyToken` by default, since token
   * needs to be a non-empty string even when ReCaptcha validation is deactivated.
   * Cf. backend logic for token validation
   */
  const requestPasswordReset = useCallback(
    async function requestPasswordReset(token = 'dummyToken') {
      clearErrors()
      try {
        setValue('isFetching', true)
        await api.postNativeV1RequestPasswordReset({
          email,
          token: isRecaptchaEnabled ? token : undefined,
        })
        replace('ResetPasswordEmailSent', { email })
      } catch (error) {
        setCustomError('Un problème est survenu pendant la réinitialisation, réessaie plus tard.')
        if (error instanceof ApiError && !isAPIExceptionCapturedAsInfo(error.statusCode)) {
          captureMonitoringError(error.message, 'ForgottenPasswordRequestResetError')
        }
      } finally {
        setValue('isFetching', false)
      }
    },
    [clearErrors, email, replace, setCustomError, setValue, isRecaptchaEnabled]
  )

  const openReCaptchaChallenge = useCallback(
    function openReCaptchaChallenge() {
      if (!isEmailValid(email)) {
        return setCustomError(
          'L’e-mail renseigné est incorrect. Exemple de format attendu\u00a0: edith.piaf@email.fr'
        )
      }
      if (!networkInfo.isConnected) {
        return setCustomError('Hors connexion\u00a0: en attente du réseau.')
      }
      setValue('isDoingReCaptchaChallenge', true)
      clearErrors()
    },
    [clearErrors, email, networkInfo.isConnected, setCustomError, setValue]
  )

  const errorValues = Object.values(errors)

  return useMemo(
    () => ({
      control,
      openReCaptchaChallenge,
      requestPasswordReset,
      shouldDisableValidateButton: isValueEmpty(email) || isFetching,
      hasError: Boolean(errorValues.length),
      lastError: errorValues.at(-1)?.message,
      isFetching,
      isDoingReCaptchaChallenge,
      async onReCaptchaSuccess(token: string) {
        setValue('isDoingReCaptchaChallenge', false)
        await requestPasswordReset(token)
      },
      onReCaptchaExpire() {
        setValue('isDoingReCaptchaChallenge', false)
        setCustomError('Le token reCAPTCHA a expiré, tu peux réessayer.')
      },
      onReCaptchaClose() {
        setValue('isDoingReCaptchaChallenge', false)
      },
      onReCaptchaError(errorCode: ReCaptchaError, error: string | undefined) {
        setValue('isDoingReCaptchaChallenge', false)
        if (errorCode === 'ReCaptchaNetworkError') {
          setCustomError(
            'Un problème est survenu pendant la réinitialisation, vérifie ta connexion internet et réessaie plus tard.'
          )
        } else {
          setCustomError('Un problème est survenu pendant la réinitialisation, réessaie plus tard.')
          captureMonitoringError(
            `${errorCode} ${error ?? 'EMPTY_ERROR'}`,
            'ForgottenPasswordOnRecaptchaError'
          )
        }
      },
      onBackNavigation() {
        navigate('Login', { from: StepperOrigin.FORGOTTEN_PASSWORD })
      },
    }),
    [
      control,
      email,
      errorValues,
      isDoingReCaptchaChallenge,
      isFetching,
      navigate,
      openReCaptchaChallenge,
      requestPasswordReset,
      setCustomError,
      setValue,
    ]
  )
}
