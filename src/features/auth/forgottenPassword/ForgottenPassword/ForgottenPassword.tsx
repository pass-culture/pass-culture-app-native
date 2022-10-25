import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useMemo } from 'react'
import { useForm, Controller, FieldPath } from 'react-hook-form'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { api } from 'api/api'
import { ApiError } from 'api/apiHelpers'
import { useAppSettings } from 'features/auth/settings'
import { navigateToHome } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { captureMonitoringError } from 'libs/monitoring'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { ReCaptcha } from 'libs/recaptcha/ReCaptcha'
import { BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { isEmailValid } from 'ui/components/inputs/emailCheck'
import { EmailInput } from 'ui/components/inputs/EmailInput'
import { isValueEmpty } from 'ui/components/inputs/helpers'
import { InputError } from 'ui/components/inputs/InputError'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing, Spacer, Typo } from 'ui/theme'

type FormValues = {
  email: string
  isFetching: boolean
  isDoingReCaptchaChallenge: boolean
  network: void
  reCaptcha: void
}

const emailErrorMessageId = uuidv4()

export const ForgottenPassword = () => {
  const { data: settings, isLoading: areSettingsLoading } = useAppSettings()

  const {
    control,
    hasError,
    isDoingReCaptchaChallenge,
    isFetching,
    lastError,
    onBackNavigation,
    onReCaptchaClose,
    onReCaptchaError,
    onReCaptchaExpire,
    onReCaptchaSuccess,
    openReCaptchaChallenge,
    requestPasswordReset,
    shouldDisableValidateButton,
  } = useForgottenPasswordForm()

  return (
    <BottomContentPage>
      {!!settings?.isRecaptchaEnabled && (
        <ReCaptcha
          onClose={onReCaptchaClose}
          onError={onReCaptchaError}
          onExpire={onReCaptchaExpire}
          onSuccess={onReCaptchaSuccess}
          isVisible={isDoingReCaptchaChallenge}
        />
      )}
      <ModalHeader
        title="Mot de passe oublié"
        leftIconAccessibilityLabel="Revenir en arrière"
        leftIcon={ArrowPrevious}
        onLeftIconPress={onBackNavigation}
        rightIconAccessibilityLabel="Revenir à l'accueil"
        rightIcon={Close}
        onRightIconPress={navigateToHome}
      />
      <ModalContent>
        <CenteredText>
          <Typo.Body>
            Saisis ton adresse e-mail pour recevoir un lien qui te permettra de réinitialiser ton
            mot de passe&nbsp;!
          </Typo.Body>
        </CenteredText>
        <Spacer.Column numberOfSpaces={4} />
        <Form.MaxWidth>
          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <EmailInput
                label="Adresse e-mail"
                email={value}
                onEmailChange={onChange}
                autoFocus
                accessibilityDescribedBy={emailErrorMessageId}
              />
            )}
          />

          <InputError
            visible={hasError}
            messageId={lastError}
            numberOfSpacesTop={2}
            relatedInputId={emailErrorMessageId}
          />
          <Spacer.Column numberOfSpaces={6} />
          <ButtonPrimary
            wording="Valider"
            onPress={settings?.isRecaptchaEnabled ? openReCaptchaChallenge : requestPasswordReset}
            isLoading={isDoingReCaptchaChallenge || isFetching || areSettingsLoading}
            disabled={shouldDisableValidateButton}
          />
        </Form.MaxWidth>
      </ModalContent>
    </BottomContentPage>
  )
}

const useForgottenPasswordForm = () => {
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
    (field: FieldPath<FormValues>, message: string) => {
      return setError(field, { type: 'custom', message })
    },
    [setError]
  )

  const onConnection = useCallback(clearErrors, [clearErrors])
  const onConnectionLost = useCallback(() => {
    setCustomError('network', 'Hors connexion\u00a0: en attente du réseau.')
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
        await api.postnativev1requestPasswordReset({ email, token })
        replace('ResetPasswordEmailSent', { email })
      } catch (error) {
        setCustomError(
          'email',
          'Un problème est survenu pendant la réinitialisation, réessaie plus tard.'
        )
        if (error instanceof ApiError) {
          captureMonitoringError(error.message, 'ForgottenPasswordRequestResetError')
        }
      } finally {
        setValue('isFetching', false)
      }
    },
    [clearErrors, email, replace, setCustomError, setValue]
  )

  const openReCaptchaChallenge = useCallback(
    function openReCaptchaChallenge() {
      if (!isEmailValid(email)) {
        return setCustomError(
          'email',
          'L’e-mail renseigné est incorrect. Exemple de format attendu\u00a0: edith.piaf@email.fr'
        )
      }
      if (!networkInfo.isConnected) {
        return setCustomError('network', 'Hors connexion\u00a0: en attente du réseau.')
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
        setCustomError('reCaptcha', 'Le token reCAPTCHA a expiré, tu peux réessayer.')
      },
      onReCaptchaClose() {
        setValue('isDoingReCaptchaChallenge', false)
      },
      onReCaptchaError(error: string) {
        setValue('isDoingReCaptchaChallenge', false)
        setCustomError(
          'email',
          'Un problème est survenu pendant la réinitialisation, réessaie plus tard.'
        )
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

const ModalContent = styled.View({
  paddingTop: getSpacing(7),
  alignItems: 'center',
  width: '100%',
})

const CenteredText = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  maxWidth: theme.contentPage.maxWidth,
}))
