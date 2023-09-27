import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { UseQueryResult } from 'react-query'

import { api } from 'api/api'
import { ApiError, isAPIExceptionCapturedAsInfo } from 'api/apiHelpers'
import { SettingsResponse } from 'api/gen'
import { useSettingsContext } from 'features/auth/context/SettingsContext'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { captureMonitoringError, eventMonitoring } from 'libs/monitoring'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { ReCaptcha } from 'libs/recaptcha/ReCaptcha'
import { EmailInputController } from 'shared/forms/controllers/EmailInputController'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { isEmailValid } from 'ui/components/inputs/emailCheck'
import { isValueEmpty } from 'ui/components/inputs/helpers'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type FormValues = {
  email: string
  isFetching: boolean
  isDoingReCaptchaChallenge: boolean
  network: void
  reCaptcha: void
}

export const ForgottenPassword = () => {
  const { data: settings, isLoading: areSettingsLoading } = useSettingsContext()

  const {
    control,
    isDoingReCaptchaChallenge,
    isFetching,
    onBackNavigation,
    onReCaptchaClose,
    onReCaptchaError,
    onReCaptchaExpire,
    onReCaptchaSuccess,
    openReCaptchaChallenge,
    requestPasswordReset,
    shouldDisableValidateButton,
  } = useForgottenPasswordForm(settings)

  return (
    <SecondaryPageWithBlurHeader
      headerTitle="Oubli de mot de passe"
      shouldDisplayBackButton
      onGoBack={onBackNavigation}>
      {!!settings?.isRecaptchaEnabled && (
        <ReCaptcha
          onClose={onReCaptchaClose}
          onError={onReCaptchaError}
          onExpire={onReCaptchaExpire}
          onSuccess={onReCaptchaSuccess}
          isVisible={isDoingReCaptchaChallenge}
        />
      )}
      <Spacer.Column numberOfSpaces={6} />
      <Typo.Title3 {...getHeadingAttrs(2)}>Mot de passe oublié&nbsp;?</Typo.Title3>
      <Spacer.Column numberOfSpaces={2} />
      <Typo.Body>
        Saisis ton adresse e-mail pour recevoir un lien qui te permettra de réinitialiser ton mot de
        passe&nbsp;!
      </Typo.Body>
      <Spacer.Column numberOfSpaces={8} />
      <Form.MaxWidth>
        <EmailInputController control={control} name="email" autoFocus />
        <Spacer.Column numberOfSpaces={8} />
        <ButtonPrimary
          wording="Valider"
          onPress={settings?.isRecaptchaEnabled ? openReCaptchaChallenge : requestPasswordReset}
          isLoading={isDoingReCaptchaChallenge || isFetching || areSettingsLoading}
          disabled={shouldDisableValidateButton}
        />
      </Form.MaxWidth>
    </SecondaryPageWithBlurHeader>
  )
}

const useForgottenPasswordForm = (settings: UseQueryResult<SettingsResponse, unknown>['data']) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const {
    control,
    setError,
    clearErrors,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { email: '', isFetching: false, isDoingReCaptchaChallenge: false },
  })
  const { email, isFetching, isDoingReCaptchaChallenge } = watch()

  // Little helper method to make it easier to set error
  const setCustomError = useCallback(
    (message: string) => {
      return setError('email', { type: 'custom', message })
    },
    [setError]
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
          token: settings?.isRecaptchaEnabled ? token : undefined,
        })
        replace('ResetPasswordEmailSent', { email })
      } catch (error) {
        setCustomError('Un problème est survenu pendant la réinitialisation, réessaie plus tard.')
        if (error instanceof ApiError && !isAPIExceptionCapturedAsInfo(error.statusCode)) {
          captureMonitoringError(error.message, 'ForgottenPasswordRequestResetError')
        }
        if (error instanceof ApiError && isAPIExceptionCapturedAsInfo(error.statusCode)) {
          eventMonitoring.captureMessage(error.message, 'info')
        }
      } finally {
        setValue('isFetching', false)
      }
    },
    [clearErrors, email, replace, setCustomError, setValue, settings]
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
      lastError: errorValues[errorValues.length - 1]?.message,
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
      onReCaptchaError(error: string) {
        setValue('isDoingReCaptchaChallenge', false)
        setCustomError('Un problème est survenu pendant la réinitialisation, réessaie plus tard.')
        captureMonitoringError(error, 'ForgottenPasswordOnRecaptchaError')
      },
      onBackNavigation() {
        navigate('Login')
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
