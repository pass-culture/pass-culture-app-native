import { t } from '@lingui/macro'
import { useNetInfo } from '@react-native-community/netinfo'
import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useEffect, useState } from 'react'
import styled from 'styled-components/native'

import { api } from 'api/api'
import { NavigateToHomeWithoutModalOptions } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import { ReCaptcha } from 'libs/recaptcha/ReCaptcha'
import { BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { isEmailValid } from 'ui/components/inputs/emailCheck'
import { isValueEmpty } from 'ui/components/inputs/helpers'
import { InputError } from 'ui/components/inputs/InputError'
import { TextInput } from 'ui/components/inputs/TextInput'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const ForgottenPassword: FunctionComponent = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const networkInfo = useNetInfo()

  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isDoingReCaptchaChallenge, setIsDoingReCaptchaChallenge] = useState(false)
  const [isFetching, setIsFetching] = useState(false)

  const shouldDisableValidateButton = isValueEmpty(email) || isFetching

  useEffect(() => {
    if (!networkInfo.isConnected) {
      setErrorMessage(_(t`Hors connexion : en attente du réseau.`))
      setIsDoingReCaptchaChallenge(false)
    } else {
      setErrorMessage(null)
    }
  }, [networkInfo.isConnected])

  async function requestPasswordReset(token: string) {
    try {
      setIsFetching(true)
      await api.postnativev1requestPasswordReset({ email, token })
      navigate('ResetPasswordEmailSent', { email })
    } catch (_error) {
      setErrorMessage(
        _(t`Un problème est survenu pendant la réinitialisation, réessaie plus tard.`)
      )
    } finally {
      setIsFetching(false)
    }
  }

  function onBackNavigation() {
    navigate('Login')
  }

  function onClose() {
    navigate('Home', NavigateToHomeWithoutModalOptions)
  }

  function onChangeEmail(email: string) {
    if (errorMessage) {
      setErrorMessage(null)
    }
    setEmail(email)
  }

  function openReCaptchaChallenge() {
    if (!isEmailValid(email)) {
      setErrorMessage(_(t`Format de l'e-mail incorrect`))
      return
    }
    if (!networkInfo.isConnected) {
      setErrorMessage(_(t`Hors connexion : en attente du réseau.`))
      return
    }
    setIsDoingReCaptchaChallenge(true)
    setErrorMessage(null)
  }

  function onReCaptchaClose() {
    setIsDoingReCaptchaChallenge(false)
  }

  function onReCaptchaError(_error: string) {
    setIsDoingReCaptchaChallenge(false)
    setErrorMessage(_(t`Un problème est survenu pendant la réinitialisation, réessaie plus tard.`))
  }

  function onReCaptchaExpire() {
    setIsDoingReCaptchaChallenge(false)
    setErrorMessage(_(t`Le token reCAPTCHA a expiré, tu peux réessayer.`))
  }

  function onReCaptchaSuccess(token: string) {
    setIsDoingReCaptchaChallenge(false)
    requestPasswordReset(token)
  }

  return (
    <BottomContentPage>
      <ReCaptcha
        onClose={onReCaptchaClose}
        onError={onReCaptchaError}
        onExpire={onReCaptchaExpire}
        onSuccess={onReCaptchaSuccess}
        isVisible={isDoingReCaptchaChallenge}
      />
      <ModalHeader
        title={_(t`Mot de passe oublié`)}
        leftIcon={ArrowPrevious}
        onLeftIconPress={onBackNavigation}
        rightIcon={Close}
        onRightIconPress={onClose}
      />
      <ModalContent>
        <CenteredText>
          <Typo.Body>
            {_(
              t`Saisis ton adresse e-mail pour recevoir un lien qui te permettra de réinitialiser ton mot de passe !`
            )}
          </Typo.Body>
        </CenteredText>
        <Spacer.Column numberOfSpaces={4} />
        <StyledInput>
          <Typo.Body>{_(t`Adresse e-mail`)}</Typo.Body>
          <Spacer.Column numberOfSpaces={2} />
          <TextInput
            autoCapitalize="none"
            autoFocus={true}
            keyboardType="email-address"
            onChangeText={onChangeEmail}
            placeholder={_(/*i18n: email placeholder */ t`tonadresse@email.com`)}
            textContentType="emailAddress"
            value={email}
          />
          {errorMessage && <InputError visible messageId={errorMessage} numberOfSpacesTop={1} />}
        </StyledInput>
        <Spacer.Column numberOfSpaces={6} />
        <ButtonPrimary
          title={_(t`Valider`)}
          onPress={openReCaptchaChallenge}
          isLoading={isDoingReCaptchaChallenge || isFetching}
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

const StyledInput = styled.View({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '100%',
  maxWidth: getSpacing(125),
})
