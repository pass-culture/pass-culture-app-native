import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useEffect, useState } from 'react'
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
import { isEmailValid } from 'ui/components/inputs/emailCheck'
import { EmailInput } from 'ui/components/inputs/EmailInput'
import { isValueEmpty } from 'ui/components/inputs/helpers'
import { InputError } from 'ui/components/inputs/InputError'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { Form } from 'ui/web/form/Form'

export const ForgottenPassword: FunctionComponent = () => {
  const { data: settings, isLoading: areSettingsLoading } = useAppSettings()
  const { navigate, replace } = useNavigation<UseNavigationType>()
  const networkInfo = useNetInfoContext()
  const emailErrorMessageId = uuidv4()

  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isDoingReCaptchaChallenge, setIsDoingReCaptchaChallenge] = useState(false)
  const [isFetching, setIsFetching] = useState(false)

  const shouldDisableValidateButton = isValueEmpty(email) || isFetching

  useEffect(() => {
    if (!networkInfo.isConnected) {
      setErrorMessage(t`Hors connexion\u00a0: en attente du réseau.`)
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
        captureMonitoringError(error.message, 'ForgottenPasswordRequestResetError')
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

  function onEmailChange(mail: string) {
    if (errorMessage) {
      setErrorMessage(null)
    }
    setEmail(mail)
  }

  function openReCaptchaChallenge() {
    if (!isEmailValid(email)) {
      setErrorMessage(
        t`L'e-mail renseigné est incorrect. Exemple de format attendu\u00a0: edith.piaf@email.fr`
      )
      return
    }
    if (!networkInfo.isConnected) {
      setErrorMessage(t`Hors connexion\u00a0: en attente du réseau.`)
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
    captureMonitoringError(error, 'ForgottenPasswordOnRecaptchaError')
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
            {t`Saisis ton adresse e-mail pour recevoir un lien qui te permettra de réinitialiser ton mot de passe\u00a0!`}
          </Typo.Body>
        </CenteredText>
        <Spacer.Column numberOfSpaces={4} />
        <Form.MaxWidth>
          <EmailInput
            label={t`Adresse e-mail`}
            email={email}
            onEmailChange={onEmailChange}
            autoFocus={true}
            accessibilityDescribedBy={emailErrorMessageId}
          />
          <InputError
            visible={!!errorMessage}
            messageId={errorMessage}
            numberOfSpacesTop={2}
            relatedInputId={emailErrorMessageId}
          />
          <Spacer.Column numberOfSpaces={6} />
          <ButtonPrimary
            wording={t`Valider`}
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
        </Form.MaxWidth>
      </ModalContent>
    </BottomContentPage>
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
