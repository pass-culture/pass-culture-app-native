import { t } from '@lingui/macro'
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
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
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
      setErrorMessage(t`Hors connexion\u00a0: en attente du réseau.`)
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
      setErrorMessage(t`Un problème est survenu pendant l'inscription, réessaie plus tard.`)
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
    setErrorMessage(t`Un problème est survenu pendant l'inscription, réessaie plus tard.`)
    captureMonitoringError(error, 'AcceptCguOnReCaptchaError')
  }

  function onReCaptchaExpire() {
    setIsDoingReCaptchaChallenge(false)
    setErrorMessage(t`Le token reCAPTCHA a expiré, tu peux réessayer.`)
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
          <Typo.Body>{t`En cliquant sur “Accepter et s’inscrire”, tu acceptes nos `}</Typo.Body>
          <ExternalLink
            text={t`Conditions Générales d'Utilisation`}
            url={env.CGU_LINK}
            primary
            testID="external-link-cgu"
          />
          <Spacer.Row numberOfSpaces={1} />
          <Typo.Body>{t` ainsi que notre `}</Typo.Body>
          <ExternalLink
            text={t`Politique de confidentialité.`}
            primary
            url={env.PRIVACY_POLICY_LINK}
            testID="external-link-privacy-policy"
          />
        </Paragraphe>
        <Spacer.Column numberOfSpaces={5} />
        <Paragraphe>
          <Typo.Body>
            {t`Pour en savoir plus sur la gestion de tes données personnelles et exercer tes droits tu peux\u00a0:`}
          </Typo.Body>
        </Paragraphe>
        <TouchableLink
          as={ButtonTertiaryPrimary}
          wording={t`Contacter le support`}
          accessibilityLabel={t`Ouvrir le gestionnaire mail pour contacter le support`}
          externalNav={contactSupport.forGenericQuestion}
          icon={Email}
        />
        <Spacer.Column numberOfSpaces={6} />
        <ButtonPrimary
          wording={t`Accepter et s’inscrire`}
          accessibilityLabel={t`Accepter les conditions générales d'utilisation et la politique de confidentialité pour s’inscrire`}
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
