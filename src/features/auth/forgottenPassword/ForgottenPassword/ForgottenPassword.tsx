import { t } from '@lingui/macro'
import { useNetInfo } from '@react-native-community/netinfo'
import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useEffect, useState } from 'react'
import styled from 'styled-components/native'

import { api } from 'api/api'
import { ApiError } from 'api/apiHelpers'
import { useAppSettings } from 'features/auth/settings'
import { navigateToHome } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { MonitoringError } from 'libs/monitoring'
import { ReCaptcha } from 'libs/recaptcha/ReCaptcha'
import { BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { isEmailValid } from 'ui/components/inputs/emailCheck'
import { EmailInput } from 'ui/components/inputs/EmailInput'
import { isValueEmpty } from 'ui/components/inputs/helpers'
import { InputContainer } from 'ui/components/inputs/InputContainer'
import { InputError } from 'ui/components/inputs/InputError'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const ForgottenPassword: FunctionComponent = () => {
  const { data: settings, isLoading: areSettingsLoading } = useAppSettings()
  const { navigate, replace } = useNavigation<UseNavigationType>()
  const networkInfo = useNetInfo()

  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isDoingReCaptchaChallenge, setIsDoingReCaptchaChallenge] = useState(false)
  const [isFetching, setIsFetching] = useState(false)

  const shouldDisableValidateButton = isValueEmpty(email) || isFetching

  useEffect(() => {
    if (!networkInfo.isConnected) {
      setErrorMessage(t`Hors connexion : en attente du réseau.`)
      setIsDoingReCaptchaChallenge(false)
    } else {
      setErrorMessage(null)
    }
  }, [networkInfo.isConnected])

  async function requestPasswordReset(token: string) {
    setErrorMessage(null)
    try {
      setIsFetching(true)
      await api.postnativev1requestPasswordReset({ email, token })
      replace('ResetPasswordEmailSent', { email })
    } catch (error) {
      setErrorMessage(t`Un problème est survenu pendant la réinitialisation, réessaie plus tard.`)
      if (error instanceof ApiError) {
        new MonitoringError(error.message, 'ForgottenPasswordRequestResetError')
      }
    } finally {
      setIsFetching(false)
    }
  }

  function onBackNavigation() {
    navigate('Login')
  }

  function onClose() {
    navigateToHome()
  }

  function onEmailChange(email: string) {
    if (errorMessage) {
      setErrorMessage(null)
    }
    setEmail(email)
  }

  function openReCaptchaChallenge() {
    if (!isEmailValid(email)) {
      setErrorMessage(t`Format de l'e-mail incorrect`)
      return
    }
    if (!networkInfo.isConnected) {
      setErrorMessage(t`Hors connexion : en attente du réseau.`)
      return
    }
    setIsDoingReCaptchaChallenge(true)
    setErrorMessage(null)
  }

  function onReCaptchaClose() {
    setIsDoingReCaptchaChallenge(false)
  }

  function onReCaptchaError(error: string) {
    setIsDoingReCaptchaChallenge(false)
    setErrorMessage(t`Un problème est survenu pendant la réinitialisation, réessaie plus tard.`)
    new MonitoringError(error, 'ForgottenPasswordOnRecaptchaError')
  }

  function onReCaptchaExpire() {
    setIsDoingReCaptchaChallenge(false)
    setErrorMessage(t`Le token reCAPTCHA a expiré, tu peux réessayer.`)
  }

  function onReCaptchaSuccess(token: string) {
    setIsDoingReCaptchaChallenge(false)
    requestPasswordReset(token)
  }

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
        title={t`Mot de passe oublié`}
        leftIconAccessibilityLabel={t`Revenir en arrière`}
        leftIcon={ArrowPrevious}
        onLeftIconPress={onBackNavigation}
        rightIconAccessibilityLabel={t`Revenir à l'accueil`}
        rightIcon={Close}
        onRightIconPress={onClose}
      />
      <ModalContent>
        <CenteredText>
          <Typo.Body>
            {t`Saisis ton adresse e-mail pour recevoir un lien qui te permettra de réinitialiser ton mot de passe !`}
          </Typo.Body>
        </CenteredText>
        <Spacer.Column numberOfSpaces={4} />
        <InputContainer>
          <EmailInput
            label={t`Adresse e-mail`}
            email={email}
            onEmailChange={onEmailChange}
            autoFocus={true}
          />
          {!!errorMessage && <InputError visible messageId={errorMessage} numberOfSpacesTop={1} />}
        </InputContainer>
        <Spacer.Column numberOfSpaces={6} />
        <ButtonPrimary
          title={t`Valider`}
          // Token needs to be a non-empty string even when ReCaptcha validation is deactivated
          // Cf. backend logic for token validation
          onPress={
            settings?.isRecaptchaEnabled
              ? openReCaptchaChallenge
              : () => requestPasswordReset('dummyToken')
          }
          isLoading={isDoingReCaptchaChallenge || isFetching || areSettingsLoading}
          disabled={shouldDisableValidateButton}
        />
      </ModalContent>
    </BottomContentPage>
  )
}

const ModalContent = styled.View({
  paddingTop: getSpacing(7),
  alignItems: 'center',
  width: '100%',
})

const CenteredText = styled.Text({
  textAlign: 'center',
})
