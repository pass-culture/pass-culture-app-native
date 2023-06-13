import React, { FunctionComponent, useEffect, useState, useCallback, useMemo } from 'react'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { useSettingsContext } from 'features/auth/context/SettingsContext'
import { contactSupport } from 'features/auth/helpers/contactSupport'
import { PreValidationSignupLastStepProps } from 'features/auth/types'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { captureMonitoringError } from 'libs/monitoring'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { ReCaptcha } from 'libs/recaptcha/ReCaptcha'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryPrimary } from 'ui/components/buttons/ButtonTertiaryPrimary'
import { ExternalLink } from 'ui/components/buttons/externalLink/ExternalLink'
import { InputError } from 'ui/components/inputs/InputError'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { Email } from 'ui/svg/icons/Email'
import { Spacer, Typo } from 'ui/theme'

export const AcceptCguV2: FunctionComponent<PreValidationSignupLastStepProps> = ({ signUp }) => {
  const { data: settings, isLoading: areSettingsLoading } = useSettingsContext()
  const networkInfo = useNetInfoContext()
  const checkCGUErrorId = uuidv4()

  const [isDoingReCaptchaChallenge, setIsDoingReCaptchaChallenge] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!networkInfo.isConnected) {
      setErrorMessage('Hors connexion\u00a0: en attente du réseau.')
      setIsDoingReCaptchaChallenge(false)
    } else {
      setErrorMessage(null)
    }
  }, [networkInfo.isConnected])

  const handleSignup = useCallback(
    async (token: string) => {
      setErrorMessage(null)
      try {
        setIsFetching(true)
        await signUp(token)
      } catch {
        setErrorMessage('Un problème est survenu pendant l’inscription, réessaie plus tard.')
      } finally {
        setIsFetching(false)
      }
    },
    [signUp]
  )

  const openReCaptchaChallenge = useCallback(() => {
    if (!networkInfo.isConnected) {
      return
    }
    setIsDoingReCaptchaChallenge(true)
    setErrorMessage(null)
  }, [networkInfo.isConnected])

  const onReCaptchaClose = useCallback(() => {
    setIsDoingReCaptchaChallenge(false)
  }, [])

  const onReCaptchaError = useCallback((error: string) => {
    setIsDoingReCaptchaChallenge(false)
    setErrorMessage('Un problème est survenu pendant l’inscription, réessaie plus tard.')
    captureMonitoringError(error, 'AcceptCguOnReCaptchaError')
  }, [])

  const onReCaptchaExpire = useCallback(() => {
    setIsDoingReCaptchaChallenge(false)
    setErrorMessage('Le token reCAPTCHA a expiré, tu peux réessayer.')
  }, [])

  const onReCaptchaSuccess = useCallback(
    (token: string) => {
      setIsDoingReCaptchaChallenge(false)
      handleSignup(token)
    },
    [handleSignup]
  )

  const onSubmit = useCallback(() => {
    analytics.logContinueCGU()
    settings?.isRecaptchaEnabled ? openReCaptchaChallenge() : handleSignup('dummyToken')
  }, [settings?.isRecaptchaEnabled, openReCaptchaChallenge, handleSignup])

  const disabled = useMemo(
    () => isDoingReCaptchaChallenge || isFetching || !networkInfo.isConnected || areSettingsLoading,
    [isDoingReCaptchaChallenge, isFetching, networkInfo.isConnected, areSettingsLoading]
  )

  // ReCaptcha needs previous callbacks
  return (
    <React.Fragment>
      {!!settings?.isRecaptchaEnabled && (
        <ReCaptcha
          onClose={onReCaptchaClose}
          onError={onReCaptchaError}
          onExpire={onReCaptchaExpire}
          onSuccess={onReCaptchaSuccess}
          isVisible={isDoingReCaptchaChallenge}
        />
      )}
      <CardContent>
        <Typo.Title3>Crée-toi un compte</Typo.Title3>
        <Spacer.Column numberOfSpaces={6} />
        <Paragraphe>
          <Typo.Body>En cliquant sur “Accepter et s’inscrire”, tu acceptes nos </Typo.Body>
          <ExternalLink text="Conditions Générales d’Utilisation" url={env.CGU_LINK} primary />
          <Spacer.Row numberOfSpaces={1} />
          <Typo.Body> ainsi que notre </Typo.Body>
          <ExternalLink
            text="Politique de confidentialité."
            primary
            url={env.PRIVACY_POLICY_LINK}
          />
        </Paragraphe>
        <Spacer.Column numberOfSpaces={5} />
        <Paragraphe>
          <Typo.Body>
            Pour en savoir plus sur la gestion de tes données personnelles et exercer tes droits tu
            peux&nbsp;:
          </Typo.Body>
        </Paragraphe>
        <ExternalTouchableLink
          as={ButtonTertiaryPrimary}
          wording="Contacter le support"
          accessibilityLabel="Ouvrir le gestionnaire mail pour contacter le support"
          externalNav={contactSupport.forGenericQuestion}
          icon={Email}
        />
        <Spacer.Column numberOfSpaces={6} />
        <ButtonPrimary
          wording="Accepter et s’inscrire"
          accessibilityLabel="Accepter les conditions générales d’utilisation et la politique de confidentialité pour s’inscrire"
          // Token needs to be a non-empty string even when ReCaptcha validation is deactivated
          // Cf. backend logic for token validation
          onPress={onSubmit}
          isLoading={isDoingReCaptchaChallenge || isFetching}
          disabled={disabled}
          accessibilityDescribedBy={checkCGUErrorId}
        />
        <InputError
          visible={!!errorMessage}
          messageId={errorMessage}
          numberOfSpacesTop={5}
          relatedInputId={checkCGUErrorId}
        />
        <Spacer.Column numberOfSpaces={5} />
      </CardContent>
    </React.Fragment>
  )
}

const CardContent = styled.View({
  width: '100%',
  alignItems: 'center',
})

const Paragraphe = styled(Typo.Body)({
  flexWrap: 'wrap',
  flexShrink: 1,
  textAlign: 'center',
})
