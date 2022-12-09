import React, { FC, useEffect, useState, useCallback, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CardContent, Paragraphe } from 'features/auth/components/signupComponents'
import { useAppSettings } from 'features/auth/settings'
import { PreValidationSignupStepProps } from 'features/auth/signup/types'
import { contactSupport } from 'features/auth/support.services'
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

export const AcceptCgu: FC<PreValidationSignupStepProps> = (props) => {
  const { data: settings, isLoading: areSettingsLoading } = useAppSettings()
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

  async function handleSignup(token: string) {
    setErrorMessage(null)
    try {
      setIsFetching(true)
      await props.signUp(token)
    } catch {
      setErrorMessage('Un problème est survenu pendant l’inscription, réessaie plus tard.')
    } finally {
      setIsFetching(false)
    }
  }

  const openReCaptchaChallenge = useCallback(() => {
    if (!networkInfo.isConnected) {
      return
    }
    setIsDoingReCaptchaChallenge(true)
    setErrorMessage(null)
  }, [networkInfo.isConnected])

  function onReCaptchaClose() {
    setIsDoingReCaptchaChallenge(false)
  }

  function onReCaptchaError(error: string) {
    setIsDoingReCaptchaChallenge(false)
    setErrorMessage('Un problème est survenu pendant l’inscription, réessaie plus tard.')
    captureMonitoringError(error, 'AcceptCguOnReCaptchaError')
  }

  function onReCaptchaExpire() {
    setIsDoingReCaptchaChallenge(false)
    setErrorMessage('Le token reCAPTCHA a expiré, tu peux réessayer.')
  }

  function onReCaptchaSuccess(token: string) {
    setIsDoingReCaptchaChallenge(false)
    handleSignup(token)
  }

  const onSubmit = useCallback(() => {
    settings?.isRecaptchaEnabled ? openReCaptchaChallenge() : handleSignup('dummyToken')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings?.isRecaptchaEnabled, openReCaptchaChallenge])

  const disabled = useMemo(
    () => isDoingReCaptchaChallenge || isFetching || !networkInfo.isConnected || areSettingsLoading,
    [isDoingReCaptchaChallenge, isFetching, networkInfo.isConnected, areSettingsLoading]
  )

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
        <Paragraphe>
          <Typo.Body>En cliquant sur “Accepter et s’inscrire”, tu acceptes nos </Typo.Body>
          <ExternalLink
            text="Conditions Générales d’Utilisation"
            url={env.CGU_LINK}
            primary
            testID="external-link-cgu"
          />
          <Spacer.Row numberOfSpaces={1} />
          <Typo.Body> ainsi que notre </Typo.Body>
          <ExternalLink
            text="Politique de confidentialité."
            primary
            url={env.PRIVACY_POLICY_LINK}
            testID="external-link-privacy-policy"
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
          accessibilityLabel="Accepter les conditions générales d'utilisation et la politique de confidentialité pour s’inscrire"
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
